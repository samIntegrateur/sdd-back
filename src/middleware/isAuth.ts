import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../types/AppContext';

export const isAuth: MiddlewareFn<AppContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new Error('Vous devez être authentifié pour accéder à cette fonctionnalité');
    }
    return next();
};
