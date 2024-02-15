import type { Config } from './config.interface'

const config: Config = {
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: process.env.SWAGGER_TITLE || 'E-Library API',
    description: process.env.SWAGGER_DESCRIPTION || 'E-Library API description',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    path: process.env.SWAGGER_PATH || 'api-docs',
  },
  security: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshIn: process.env.JWT_REFRESH_IN || '7d',
    bcryptSaltOrRound: process.env.BCRYPT_SALT_OR_ROUND || 10,
  },
}

export default (): Config => config
