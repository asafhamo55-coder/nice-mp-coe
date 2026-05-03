-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('STT', 'TTS', 'V2V', 'General', 'Research');

-- CreateEnum
CREATE TYPE "SourceMethod" AS ENUM ('web_scrape', 'rss_feed', 'arxiv_api', 'reddit_api', 'api');

-- CreateEnum
CREATE TYPE "SourceFrequency" AS ENUM ('6h', 'daily');

-- CreateEnum
CREATE TYPE "BenchmarkType" AS ENUM ('STT', 'TTS', 'V2V');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('STT', 'TTS', 'V2V', 'NLU', 'Conversational', 'Platform');

-- CreateEnum
CREATE TYPE "DeploymentType" AS ENUM ('Cloud', 'OnPrem', 'Hybrid', 'Edge');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('Pending', 'Running', 'Completed', 'Failed', 'Cancelled');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('MonthlyLandscape', 'VendorComparison', 'EvaluationSummary', 'BuildVsBuy', 'IntegrationReadiness');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Generating', 'Completed', 'Failed');

-- CreateTable
CREATE TABLE "news_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL,
    "relevance_score" INTEGER NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" "SourceMethod" NOT NULL DEFAULT 'web_scrape',
    "url" TEXT NOT NULL,
    "frequency" "SourceFrequency" NOT NULL DEFAULT '6h',
    "keywords" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "pricing_url" TEXT,
    "docs_url" TEXT,
    "is_tracked" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "logo_url" TEXT,
    "founded_year" INTEGER,
    "hq_location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_results" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "benchmark_type" "BenchmarkType" NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DECIMAL(10,4) NOT NULL,
    "metric_unit" TEXT NOT NULL,
    "dataset" TEXT NOT NULL DEFAULT 'ALL',
    "language" TEXT NOT NULL DEFAULT 'en',
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benchmark_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmark_run_log" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sources_checked" INTEGER NOT NULL DEFAULT 0,
    "results_upserted" INTEGER NOT NULL DEFAULT 0,
    "results_unchanged" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "benchmark_run_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_products" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "api_endpoint" TEXT,
    "is_ga" BOOLEAN NOT NULL DEFAULT true,
    "released_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_deployment_options" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "type" "DeploymentType" NOT NULL,
    "details" TEXT,
    "regions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_deployment_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_security_certs" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "cert_name" TEXT NOT NULL,
    "cert_body" TEXT,
    "issued_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "verification_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_security_certs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_languages" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "lang_code" TEXT NOT NULL,
    "accents" TEXT[],
    "category" "ProductCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_pricing_tiers" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "tier_name" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "price_per_unit" DECIMAL(10,6) NOT NULL,
    "unit" TEXT NOT NULL,
    "monthly_minimum" DECIMAL(10,2),
    "volume_discount" TEXT,
    "commitment_terms" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nice_compatibility" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "cxone_integration_status" TEXT NOT NULL,
    "integration_method" TEXT,
    "certified_version" TEXT,
    "build_vs_buy_score" INTEGER NOT NULL,
    "build_vs_buy_rationale" TEXT,
    "migration_complexity" TEXT,
    "estimated_integration_days" INTEGER,
    "notes" TEXT,
    "assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nice_compatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_registry_run_log" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT,
    "status" TEXT NOT NULL,
    "vendors_processed" INTEGER NOT NULL DEFAULT 0,
    "fields_updated" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_registry_run_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_guidelines" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "product_slug" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_msg" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deployment_guidelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "evaluation_type" "BenchmarkType" NOT NULL,
    "model_name" TEXT NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'Pending',
    "config" JSONB NOT NULL,
    "dataset" TEXT NOT NULL DEFAULT 'standard',
    "language" TEXT NOT NULL DEFAULT 'en',
    "total_samples" INTEGER NOT NULL DEFAULT 0,
    "processed_samples" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_results" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DECIMAL(10,4) NOT NULL,
    "metric_unit" TEXT NOT NULL,
    "sample_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_datasets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "BenchmarkType" NOT NULL,
    "description" TEXT,
    "sample_count" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "samples" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'Generating',
    "summary" TEXT,
    "content" TEXT,
    "content_html" TEXT,
    "metadata" JSONB,
    "generated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_items_url_key" ON "news_items"("url");

-- CreateIndex
CREATE INDEX "news_items_category_idx" ON "news_items"("category");

-- CreateIndex
CREATE INDEX "news_items_relevance_score_idx" ON "news_items"("relevance_score");

-- CreateIndex
CREATE INDEX "news_items_date_idx" ON "news_items"("date");

-- CreateIndex
CREATE UNIQUE INDEX "news_sources_name_key" ON "news_sources"("name");

-- CreateIndex
CREATE INDEX "news_sources_enabled_idx" ON "news_sources"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_name_key" ON "vendors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_slug_key" ON "vendors"("slug");

-- CreateIndex
CREATE INDEX "benchmark_results_vendor_id_idx" ON "benchmark_results"("vendor_id");

-- CreateIndex
CREATE INDEX "benchmark_results_benchmark_type_idx" ON "benchmark_results"("benchmark_type");

-- CreateIndex
CREATE INDEX "benchmark_results_metric_name_idx" ON "benchmark_results"("metric_name");

-- CreateIndex
CREATE UNIQUE INDEX "benchmark_results_vendor_id_model_name_metric_name_dataset__key" ON "benchmark_results"("vendor_id", "model_name", "metric_name", "dataset", "language", "source_name");

-- CreateIndex
CREATE INDEX "vendor_products_vendor_id_idx" ON "vendor_products"("vendor_id");

-- CreateIndex
CREATE INDEX "vendor_products_category_idx" ON "vendor_products"("category");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_products_vendor_id_slug_key" ON "vendor_products"("vendor_id", "slug");

-- CreateIndex
CREATE INDEX "vendor_deployment_options_vendor_id_idx" ON "vendor_deployment_options"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_deployment_options_vendor_id_type_key" ON "vendor_deployment_options"("vendor_id", "type");

-- CreateIndex
CREATE INDEX "vendor_security_certs_vendor_id_idx" ON "vendor_security_certs"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_security_certs_vendor_id_cert_name_key" ON "vendor_security_certs"("vendor_id", "cert_name");

-- CreateIndex
CREATE INDEX "vendor_languages_vendor_id_idx" ON "vendor_languages"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_languages_vendor_id_lang_code_category_key" ON "vendor_languages"("vendor_id", "lang_code", "category");

-- CreateIndex
CREATE INDEX "vendor_pricing_tiers_vendor_id_idx" ON "vendor_pricing_tiers"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_pricing_tiers_vendor_id_tier_name_category_key" ON "vendor_pricing_tiers"("vendor_id", "tier_name", "category");

-- CreateIndex
CREATE UNIQUE INDEX "nice_compatibility_vendor_id_key" ON "nice_compatibility"("vendor_id");

-- CreateIndex
CREATE INDEX "deployment_guidelines_vendor_id_idx" ON "deployment_guidelines"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "deployment_guidelines_vendor_id_product_slug_key" ON "deployment_guidelines"("vendor_id", "product_slug");

-- CreateIndex
CREATE INDEX "evaluations_vendor_id_idx" ON "evaluations"("vendor_id");

-- CreateIndex
CREATE INDEX "evaluations_evaluation_type_idx" ON "evaluations"("evaluation_type");

-- CreateIndex
CREATE INDEX "evaluations_status_idx" ON "evaluations"("status");

-- CreateIndex
CREATE INDEX "evaluation_results_evaluation_id_idx" ON "evaluation_results"("evaluation_id");

-- CreateIndex
CREATE INDEX "evaluation_results_metric_name_idx" ON "evaluation_results"("metric_name");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_datasets_name_key" ON "evaluation_datasets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_datasets_slug_key" ON "evaluation_datasets"("slug");

-- CreateIndex
CREATE INDEX "evaluation_datasets_type_idx" ON "evaluation_datasets"("type");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- AddForeignKey
ALTER TABLE "benchmark_results" ADD CONSTRAINT "benchmark_results_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_products" ADD CONSTRAINT "vendor_products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_deployment_options" ADD CONSTRAINT "vendor_deployment_options_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_security_certs" ADD CONSTRAINT "vendor_security_certs_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_languages" ADD CONSTRAINT "vendor_languages_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_pricing_tiers" ADD CONSTRAINT "vendor_pricing_tiers_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nice_compatibility" ADD CONSTRAINT "nice_compatibility_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_registry_run_log" ADD CONSTRAINT "vendor_registry_run_log_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_guidelines" ADD CONSTRAINT "deployment_guidelines_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_results" ADD CONSTRAINT "evaluation_results_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
