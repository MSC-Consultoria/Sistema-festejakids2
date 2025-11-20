CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custosFixos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` int NOT NULL,
	`ativo` int NOT NULL DEFAULT 1,
	`ordem` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custosFixos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custosVariaveis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` int NOT NULL,
	`percentual` int DEFAULT 0,
	`ativo` int NOT NULL DEFAULT 1,
	`ordem` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custosVariaveis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `festas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(20) NOT NULL,
	`clienteId` int NOT NULL,
	`dataFechamento` timestamp NOT NULL,
	`dataFesta` timestamp NOT NULL,
	`valorTotal` int NOT NULL,
	`valorPago` int NOT NULL DEFAULT 0,
	`numeroConvidados` int NOT NULL,
	`tema` varchar(255),
	`horario` varchar(50),
	`status` enum('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `festas_id` PRIMARY KEY(`id`),
	CONSTRAINT `festas_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`festaId` int NOT NULL,
	`valor` int NOT NULL,
	`dataPagamento` timestamp NOT NULL,
	`metodoPagamento` varchar(50),
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pagamentos_id` PRIMARY KEY(`id`)
);
