ALTER TABLE `clientes` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `clientes` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `clientes` ADD `endereco` text;