import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './auth/user-roles';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      database: 'cms_blog',
      username: 'root',
      password: '12345678',
      port: 3306,
      autoLoadEntities: true,
      synchronize: true
    }),
    CategoryModule,
    AuthModule,
    AccessControlModule.forRoles(roles)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
