import { ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Role } from 'src/users/entities/role.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const isChangingRole = request.route.path.includes('/role');
    
    if (isChangingRole && user.role !== Role.Admin) {
      throw new ForbiddenException('Chỉ admin mới có quyền thay đổi role');
    }

    return super.canActivate(context);
  }
}
