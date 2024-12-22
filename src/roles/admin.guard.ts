import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from './roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role >= RoleEnum.admin;
  }
}
