import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (ConfigService: ConfigService) => ({

                type: ConfigService.get<string>('DB_TYPE', 'mariadb') as any,
                host: ConfigService.get<string>('DB_HOST'),
                port: ConfigService.get<string>('DB_PORT'),
                username: ConfigService.get<string>('DB_USER'),
                password: ConfigService.get<string>('DB_PASSWORD'),
                database: ConfigService.get<string>('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: true,
                logging: false,
            })
        })
    ],
})
export class DbModule {}