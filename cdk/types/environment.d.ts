export {}

declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			CDK_DEFAULT_ACCOUNT: string;
			CDK_DEFAULT_REGION: string;
		}
	}
}