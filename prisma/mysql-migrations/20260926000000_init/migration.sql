-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `slug` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `title` LONGTEXT NOT NULL,
    `titleAr` LONGTEXT NULL,
    `description` LONGTEXT NULL,
    `descriptionAr` LONGTEXT NULL,
    `client` LONGTEXT NULL,
    `clientAr` LONGTEXT NULL,
    `year` LONGTEXT NULL,
    `category` LONGTEXT NULL,
    `categoryAr` LONGTEXT NULL,
    `tags` JSON NOT NULL,
    `tagsAr` JSON NOT NULL,
    `coverImage` LONGTEXT NULL,
    `images` JSON NOT NULL,
    `videoUrl` LONGTEXT NULL,
    `gifUrl` LONGTEXT NULL,
    `liveUrl` LONGTEXT NULL,
    `githubUrl` LONGTEXT NULL,
    `caseStudyUrl` LONGTEXT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `clientId` VARCHAR(191) COLLATE utf8mb4_bin NULL,
    `projectType` VARCHAR(191) NULL DEFAULT 'web_development',
    `tagline` LONGTEXT NULL,
    `shortDescription` LONGTEXT NULL,
    `fullDescription` LONGTEXT NULL,
    `location` LONGTEXT NULL,
    `clientLogo` LONGTEXT NULL,
    `techStack` JSON NOT NULL,
    `challengePoints` JSON NOT NULL,
    `obstacles` JSON NOT NULL,
    `challengeTagline` LONGTEXT NULL,
    `challengeResponses` JSON NOT NULL,
    `solutionOptions` JSON NOT NULL,
    `clientChoice` INTEGER NULL,
    `resultSlides` JSON NOT NULL,
    `testimonialText` LONGTEXT NULL,
    `gallery` JSON NOT NULL,
    `extraMile` LONGTEXT NULL,
    `heroImage` LONGTEXT NULL,
    `tallImage` LONGTEXT NULL,
    `useTallImage` BOOLEAN NOT NULL DEFAULT false,
    `heroMediaType` VARCHAR(191) NOT NULL DEFAULT 'image',
    `clientGoals` JSON NOT NULL,
    `challenges` JSON NOT NULL,
    `results` JSON NOT NULL,
    `testimonialAuthor` LONGTEXT NULL,
    `testimonialRole` LONGTEXT NULL,
    `testimonialCompany` LONGTEXT NULL,
    `extraMilePlanned` LONGTEXT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TechItem` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `name` LONGTEXT NOT NULL,
    `icon` LONGTEXT NULL,
    `iconUrl` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientItem` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `name` LONGTEXT NOT NULL,
    `company` LONGTEXT NULL,
    `country` LONGTEXT NULL,
    `logo` LONGTEXT NULL,
    `website` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `name` LONGTEXT NOT NULL,
    `nameAr` LONGTEXT NULL,
    `role` VARCHAR(191) NOT NULL,
    `roleAr` LONGTEXT NULL,
    `bio` LONGTEXT NULL,
    `bioAr` LONGTEXT NULL,
    `photo` LONGTEXT NULL,
    `linkedinUrl` LONGTEXT NULL,
    `twitterUrl` LONGTEXT NULL,
    `email` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `title` LONGTEXT NOT NULL,
    `titleAr` LONGTEXT NULL,
    `slug` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `description` LONGTEXT NULL,
    `descriptionAr` LONGTEXT NULL,
    `shortDescription` LONGTEXT NULL,
    `tagline` LONGTEXT NULL,
    `benefits` JSON NOT NULL,
    `deliverables` JSON NOT NULL,
    `process` JSON NOT NULL,
    `techStack` JSON NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `seoTitle` LONGTEXT NULL,
    `seoDescription` LONGTEXT NULL,
    `icon` LONGTEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `faq` JSON NOT NULL,
    `ctaHeadline` LONGTEXT NULL,
    `ctaSubtext` LONGTEXT NULL,
    `ctaButtonLabel` LONGTEXT NULL,
    `ctaButtonLink` LONGTEXT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `url` VARCHAR(768) COLLATE utf8mb4_bin NOT NULL,
    `filename` LONGTEXT NULL,
    `originalName` LONGTEXT NULL,
    `mimeType` LONGTEXT NOT NULL,
    `size` INTEGER NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `alt` LONGTEXT NULL,
    `caption` LONGTEXT NULL,
    `folder` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaAsset_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `mediaId` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `projectId` VARCHAR(191) COLLATE utf8mb4_bin NULL,
    `serviceId` VARCHAR(191) COLLATE utf8mb4_bin NULL,
    `theme` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `metadata` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Attachment_projectId_role_theme_idx`(`projectId`, `role`, `theme`),
    INDEX `Attachment_serviceId_role_theme_idx`(`serviceId`, `role`, `theme`),
    INDEX `Attachment_mediaId_idx`(`mediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectService` (
    `projectId` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `serviceId` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `ProjectService_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`projectId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `headline` LONGTEXT NULL,
    `headlineAr` LONGTEXT NULL,
    `subheadline` LONGTEXT NULL,
    `subheadlineAr` LONGTEXT NULL,
    `email` LONGTEXT NULL,
    `phone` LONGTEXT NULL,
    `address` LONGTEXT NULL,
    `addressAr` LONGTEXT NULL,
    `socialLinks` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stats` JSON NOT NULL,
    `story` JSON NOT NULL,
    `mission` LONGTEXT NULL,
    `vision` LONGTEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `username` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `passwordHash` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `slug` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `title` LONGTEXT NOT NULL,
    `titleAr` LONGTEXT NULL,
    `excerpt` LONGTEXT NULL,
    `excerptAr` LONGTEXT NULL,
    `content` LONGTEXT NOT NULL DEFAULT '',
    `contentAr` LONGTEXT NULL,
    `coverImage` LONGTEXT NULL,
    `heroImage` LONGTEXT NULL,
    `tags` JSON NOT NULL,
    `tagsAr` JSON NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Post_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` VARCHAR(191) COLLATE utf8mb4_bin NOT NULL,
    `name` LONGTEXT NOT NULL,
    `email` LONGTEXT NOT NULL,
    `projectType` LONGTEXT NULL,
    `message` LONGTEXT NOT NULL,
    `contactMethod` LONGTEXT NULL,
    `contactValue` LONGTEXT NULL,
    `source` LONGTEXT NULL,
    `audioUrls` JSON NOT NULL,
    `assetNames` JSON NOT NULL,
    `metadata` JSON NOT NULL,
    `status` ENUM('NEW', 'READ', 'REPLIED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `notes` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectService` ADD CONSTRAINT `ProjectService_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectService` ADD CONSTRAINT `ProjectService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
