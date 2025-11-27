ALTER TABLE `visitacoes` ADD `codigo` varchar(20);--> statement-breakpoint
ALTER TABLE `visitacoes` ADD CONSTRAINT `visitacoes_codigo_unique` UNIQUE(`codigo`);