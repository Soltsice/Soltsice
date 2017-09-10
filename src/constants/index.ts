const isProduction = process.env.NODE_ENV === 'production';

export { isProduction };

export * from './testrpc';