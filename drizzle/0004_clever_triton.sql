CREATE TABLE `visitacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(255),
	`dataVisita` timestamp NOT NULL,
	`interesse` text,
	`status` enum('visitou','aguardando','proposta_enviada','fechado','perdido') NOT NULL DEFAULT 'visitou',
	`observacoes` text,
	`clienteId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitacoes_id` PRIMARY KEY(`id`)
);
