CREATE TABLE `contratos_gerados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`festaId` int NOT NULL,
	`url` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`versao` int NOT NULL DEFAULT 1,
	`geradoPor` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contratos_gerados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates_contrato` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`ativo` int NOT NULL DEFAULT 1,
	`servicosIncluidos` text,
	`buffetAdulto` text,
	`buffetInfantil` text,
	`brindes` text,
	`observacoesGerais` text,
	`dadosBancarios` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templates_contrato_id` PRIMARY KEY(`id`)
);
