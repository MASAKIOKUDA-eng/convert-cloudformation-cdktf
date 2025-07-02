import { TerraformConfig } from '../mapper';
/**
 * Generates CDKTF code from Terraform configuration
 */
export declare class CdktfGenerator {
    /**
     * Generate CDKTF code from Terraform configuration
     * @param config Terraform configuration
     * @param outputDir Output directory
     * @param language Target language (typescript, python, etc.)
     */
    static generateCode(config: TerraformConfig, outputDir: string, language?: 'typescript' | 'python' | 'java'): void;
    /**
     * Generate TypeScript CDKTF code
     * @param config Terraform configuration
     * @param outputDir Output directory
     */
    private static generateTypeScriptCode;
    /**
     * Generate TypeScript main file
     * @param config Terraform configuration
     */
    private static generateTypeScriptMainFile;
    /**
     * Generate TypeScript resource
     * @param resource Terraform resource
     */
    private static generateTypeScriptResource;
    /**
     * Generate cdktf.json configuration
     */
    private static generateCdktfConfig;
    /**
     * Generate package.json
     */
    private static generatePackageJson;
    /**
     * Generate Python CDKTF code
     * @param config Terraform configuration
     * @param outputDir Output directory
     */
    private static generatePythonCode;
    /**
     * Generate Java CDKTF code
     * @param config Terraform configuration
     * @param outputDir Output directory
     */
    private static generateJavaCode;
    /**
     * Convert Terraform type to TypeScript type
     * @param terraformType Terraform type
     */
    private static terraformTypeToTypeScript;
    /**
     * Convert string to PascalCase
     * @param str Input string
     */
    private static pascalCase;
}
