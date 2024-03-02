import { moduleName } from "../Models/ModuleInfo";
export default abstract class SettingBase {
    public abstract name: string;
    public abstract value: string;
    public abstract description: string;
    public abstract type: string;
    public abstract forModule: moduleName;
}