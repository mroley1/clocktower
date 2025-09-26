
/**
 * Representation of a script or role version
 * 
 * Versions are expressed in the form of
 * v{major version}.{version}.{minor version}{sub-minor version opt.}
 * 
 * each version level may not exceed 999 and the subversion my not exceed 5 places
 */
export default class Version {
    private majorVersion: number
    private version: number
    private minorVersion: number
    private subVersion: string|undefined
    
    constructor(versionString: string|null) {
        if (!versionString) {
            this.majorVersion = 1;
            this.version = 0;
            this.minorVersion = 0;
            this.subVersion = undefined;
        } else {
            const tokens = versionString.split(/\.|^v/)
            this.majorVersion = Number.parseInt(tokens[1])
            this.version = Number.parseInt(tokens[2])
            this.minorVersion = Number.parseInt(tokens[3])
            this.subVersion = versionString.match(/[a-z]+$/)?.[0]
        }
    }
    
    valueOf(): string {
        const majorVersion = String(this.majorVersion).padStart(3, '0');
        const version = String(this.version).padStart(3, '0');
        const minorVersion = String(this.minorVersion).padStart(3, '0');
        const subVersion = String(this.subVersion).padStart(5, '~');
        return `${majorVersion}${version}${minorVersion}${subVersion}`
    }
    
    toString(): string {
        return this.valueOf();
    }
    
    value(): string {
        return versionToString(this.majorVersion, this.version, this.minorVersion, this.subVersion)
    }
    
    equals(other: Version): boolean {
        return other.valueOf() == this.valueOf()
    }
    
}

export class versionBuilder {
    
    private majorVersion = 1;
    private version = 0;
    private minorVersion = 0;
    private subVersion = ""
    
    public WithMajorVersion(versionNumber: number) {
        this.majorVersion = versionNumber;
        return this;
    }
    
    public WithVersion(versionNumber: number) {
        this.version = versionNumber;
        return this;
    }
    
    public WithMinorVersion(versionNumber: number) {
        this.minorVersion = versionNumber;
        return this;
    }
    
    public WithSubVersion(versionString: string) {
        this.subVersion = versionString;
        return this;
    }
    
    public Build() {
        const versionString = versionToString(this.majorVersion, this.version, this.minorVersion, this.subVersion);
        return new Version(versionString);
    }
}

function versionToString(majorVersion: number, version: number, minorVersion: number, subVersion: string|undefined) {
    if (!subVersion) {subVersion = ""}
    return `v${majorVersion}.${version}.${minorVersion}${subVersion}`
}