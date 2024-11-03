import { NestFactory } from '@nestjs/core';
import { PersistenceModule } from '@src/module/content/persistence/persistence.module';
import { ConfigService } from '@src/shared/module/config/config.service';
import { TypeOrmMigrationService } from '@src/shared/module/persistence/typeorm/service/typeorm-migration.service';
import { DataSourceOptions } from 'typeorm';
import { createPostgresDatabase } from 'typeorm-extension';

const createDatabaseModule = async () => {
  return await NestFactory.createApplicationContext(
    PersistenceModule.forRoot({
      migrations: [__dirname + '/migration/*'],
    })
  );
};

export const migrate = async () => {
  const migrationModule = await createDatabaseModule();
  migrationModule.init();
  const configService = migrationModule.get<ConfigService>(ConfigService);
  const options = {
    type: 'postgres',
    ...configService.get('database'),
  } as DataSourceOptions;
  await createPostgresDatabase({
    ifNotExist: true,
    options,
  });
  await migrationModule.get(TypeOrmMigrationService).migrate();
};

export const getDataSource = async () => {
  const migrationModule = await createDatabaseModule();
  return migrationModule.get(TypeOrmMigrationService).getDataSource();
};
