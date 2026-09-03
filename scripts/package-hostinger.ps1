[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$KeepStaging,
    [switch]$IncludeAllCreativeAssets
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$buildRoot = Join-Path $projectRoot ".next"
$standaloneRoot = Join-Path $buildRoot "standalone"
$publicRoot = Join-Path $projectRoot "public"
$stagingRoot = Join-Path $projectRoot ".hostinger-package"
$archivePath = Join-Path $projectRoot "hostinger-deploy.zip"

function Copy-DirectoryContents {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Source,

        [Parameter(Mandatory = $true)]
        [string]$Destination,

        [string[]]$ExcludeNames = @()
    )

    if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
        throw "Required directory not found: $Source"
    }

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null

    Get-ChildItem -LiteralPath $Source -Force | Where-Object {
        $ExcludeNames -notcontains $_.Name
    } | ForEach-Object {
        $target = Join-Path $Destination $_.Name
        Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
    }
}

function Copy-PublicAssets {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Source,

        [Parameter(Mandatory = $true)]
        [string]$Destination
    )

    if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
        throw "Required directory not found: $Source"
    }

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null

    # All public assets are production files except the large creative archive.
    Get-ChildItem -LiteralPath $Source -Force | Where-Object {
        $_.Name -ne "creative"
    } | ForEach-Object {
        $target = Join-Path $Destination $_.Name
        Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
    }

    $publicCreative = Join-Path $Source "creative"
    $rootCreative = Join-Path $projectRoot "creative"
    $creativeSource = $null

    if (Test-Path -LiteralPath $publicCreative -PathType Container) {
        $creativeSource = $publicCreative
    } elseif (Test-Path -LiteralPath $rootCreative -PathType Container) {
        # The current worktree has this folder outside public. Use it only as an
        # asset source; never copy the whole design/archive folder.
        $creativeSource = $rootCreative
        Write-Warning "public/creative is missing. Reading referenced production assets from the root creative/ folder."
    }

    if ($null -eq $creativeSource) {
        Write-Warning "No creative asset directory found. /creative assets will not be included."
        return
    }

    $creativeDestination = Join-Path $Destination "creative"
    New-Item -ItemType Directory -Path $creativeDestination -Force | Out-Null

    if ($IncludeAllCreativeAssets) {
        Copy-DirectoryContents -Source $creativeSource -Destination $creativeDestination
        Write-Warning "Included every creative asset because -IncludeAllCreativeAssets was supplied."
        return
    }

    # Keep only asset paths that are literal references in application source or
    # CSS. This excludes PSD/EPS/PPTX/ZIP files, screenshots, drafts, and logs.
    $assetPattern = "/creative/(?<asset>[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|avif|svg|gif|mp4|webm))"
    $referencedAssets = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    Get-ChildItem -LiteralPath (Join-Path $projectRoot "src") -Recurse -File -Force | ForEach-Object {
        $contents = Get-Content -LiteralPath $_.FullName -Raw
        foreach ($match in [regex]::Matches($contents, $assetPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
            [void]$referencedAssets.Add($match.Groups["asset"].Value.Replace("/", [IO.Path]::DirectorySeparatorChar))
        }
    }

    if ($referencedAssets.Count -eq 0) {
        Write-Warning "No literal /creative asset references were found in src."
        return
    }

    $copiedAssets = 0
    foreach ($asset in ($referencedAssets | Sort-Object)) {
        $sourceAsset = Join-Path $creativeSource $asset
        if (-not (Test-Path -LiteralPath $sourceAsset -PathType Leaf)) {
            Write-Warning "Referenced creative asset is missing: /creative/$($asset.Replace([IO.Path]::DirectorySeparatorChar, "/"))"
            continue
        }

        $destinationAsset = Join-Path $creativeDestination $asset
        $destinationDirectory = Split-Path -Parent $destinationAsset
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
        Copy-Item -LiteralPath $sourceAsset -Destination $destinationAsset -Force
        $copiedAssets++
    }

    Write-Host "Creative assets selected: $copiedAssets of $($referencedAssets.Count) literal reference(s)."
}

if (-not $SkipBuild) {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        $buildCommand = "pnpm"
        $buildArguments = @("run", "build")
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        $buildCommand = "npm"
        $buildArguments = @("run", "build")
    } elseif (Get-Command corepack -ErrorAction SilentlyContinue) {
        $buildCommand = "corepack"
        $buildArguments = @("pnpm", "run", "build")
    } else {
        throw "Neither pnpm nor npm is available on PATH."
    }

    Write-Host "Building the production standalone bundle with $buildCommand ..."
    Push-Location $projectRoot
    try {
        & $buildCommand @buildArguments
        if ($LASTEXITCODE -ne 0) {
            throw "Production build failed with exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "Skipping build because -SkipBuild was supplied."
}

if (-not (Test-Path -LiteralPath (Join-Path $standaloneRoot "server.js") -PathType Leaf)) {
    throw "The standalone build was not found at $standaloneRoot. Run a successful production build first."
}

# Remove env files from the generated build output as well as from the ZIP.
# Next can copy them into standalone during output tracing.
$generatedEnvFiles = Get-ChildItem -LiteralPath $standaloneRoot -Recurse -File -Force | Where-Object {
    $_.Name -match '^\.env(?:\..*)?$'
}
foreach ($envFile in $generatedEnvFiles) {
    Remove-Item -LiteralPath $envFile.FullName -Force
}

if (Test-Path -LiteralPath $stagingRoot) {
    Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}

if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
}

New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null

# Next.js traces the server into standalone. Do not copy its node_modules:
# the local build runs on Windows, while Hostinger runs Linux. Hostinger will
# install the correct platform-specific production dependencies from npm.
Copy-DirectoryContents `
    -Source $standaloneRoot `
    -Destination $stagingRoot `
    -ExcludeNames @("node_modules", "public", ".next", ".env")

$stagingNextRoot = Join-Path $stagingRoot ".next"
Copy-DirectoryContents `
    -Source (Join-Path $standaloneRoot ".next") `
    -Destination $stagingNextRoot `
    -ExcludeNames @("node_modules")

# Next's standalone server does not include these two directories automatically.
$stagingPublicRoot = Join-Path $stagingRoot "public"
if (Test-Path -LiteralPath $stagingPublicRoot) {
    Remove-Item -LiteralPath $stagingPublicRoot -Recurse -Force
}
Copy-PublicAssets -Source $publicRoot -Destination $stagingPublicRoot

$staticDestination = Join-Path $stagingRoot ".next\static"
if (Test-Path -LiteralPath $staticDestination) {
    Remove-Item -LiteralPath $staticDestination -Recurse -Force
}
Copy-DirectoryContents -Source (Join-Path $buildRoot "static") -Destination $staticDestination

# npm ci on Hostinger will regenerate the Prisma client using Linux packages.
# Keep only the schema and migrations needed for that installation/runtime.
$stagingPrismaRoot = Join-Path $stagingRoot "prisma"
New-Item -ItemType Directory -Path $stagingPrismaRoot -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "prisma\schema.prisma") -Destination (Join-Path $stagingPrismaRoot "schema.prisma") -Force
if (Test-Path -LiteralPath (Join-Path $projectRoot "prisma\migrations") -PathType Container) {
    Copy-DirectoryContents `
        -Source (Join-Path $projectRoot "prisma\migrations") `
        -Destination (Join-Path $stagingPrismaRoot "migrations")
}

# The source config loads dotenv, which is a development dependency. This
# deployment-only config keeps `npm ci --omit=dev` self-contained.
@"
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL! },
});
"@ | Set-Content -LiteralPath (Join-Path $stagingRoot "prisma.config.ts") -Encoding UTF8

# Output tracing can copy local env files used during the build. Never deploy
# them: Hostinger environment variables must be configured in its panel.
$stagedEnvFiles = Get-ChildItem -LiteralPath $stagingRoot -Recurse -File -Force | Where-Object {
    $_.Name -match '^\.env(?:\..*)?$'
}
foreach ($envFile in $stagedEnvFiles) {
    Remove-Item -LiteralPath $envFile.FullName -Force
}

$remainingEnvFiles = Get-ChildItem -LiteralPath $stagingRoot -Recurse -File -Force | Where-Object {
    $_.Name -match '^\.env(?:\..*)?$'
}
if ($remainingEnvFiles) {
    throw "Refusing to create an archive because an environment file remains in staging."
}

# Hostinger installs dependencies on Linux. Keep the original dependency
# versions but expose only the production start/install commands in the ZIP.
$sourcePackage = Get-Content -LiteralPath (Join-Path $projectRoot "package.json") -Raw | ConvertFrom-Json
$deploymentPackage = [ordered]@{
    name = $sourcePackage.name
    version = $sourcePackage.version
    private = $true
    scripts = [ordered]@{
        start = "node server.js"
        postinstall = "prisma generate"
    }
    dependencies = $sourcePackage.dependencies
    devDependencies = $sourcePackage.devDependencies
}
$deploymentPackage |
    ConvertTo-Json -Depth 4 |
    Set-Content -LiteralPath (Join-Path $stagingRoot "package.json") -Encoding UTF8
Copy-Item -LiteralPath (Join-Path $projectRoot "package-lock.json") -Destination (Join-Path $stagingRoot "package-lock.json") -Force

@"
# Hostinger deployment

This archive was built from a Windows development machine, so it intentionally
does not contain node_modules. Install dependencies on Hostinger so native
packages such as sharp are the Linux versions:

1. Use Node.js 20.9 or newer.
2. Configure the app environment variables in Hostinger before installing.
   At minimum this app needs DATABASE_URL, JWT_SECRET, the Supabase variables,
   and any Cloudinary variables used by your deployment.
3. In the extracted app directory, run:

   npm ci --omit=dev

4. Set the application startup file to server.js, or run:

   npm start

The Next.js production bundle, public assets, Prisma schema, and migrations are
already included. Do not upload .env files or run the development build on the
server. The public/uploads directory must remain writable because the app saves
uploaded media there.
"@ | Set-Content -LiteralPath (Join-Path $stagingRoot "HOSTINGER-SETUP.md") -Encoding UTF8

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $stagingRoot,
    $archivePath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

$stagedBytes = (Get-ChildItem -LiteralPath $stagingRoot -Recurse -File -Force | Measure-Object -Property Length -Sum).Sum
$archiveBytes = (Get-Item -LiteralPath $archivePath).Length

Write-Host ""
Write-Host "Hostinger package created: $archivePath"
Write-Host ("Staged files: {0:N2} MB" -f ($stagedBytes / 1MB))
Write-Host ("ZIP size:      {0:N2} MB" -f ($archiveBytes / 1MB))
Write-Host "node_modules were intentionally omitted for Linux compatibility. After extraction, run: npm ci --omit=dev"
Write-Host "Then set the startup file to server.js and add your environment variables in Hostinger."

if (-not $KeepStaging) {
    Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}
