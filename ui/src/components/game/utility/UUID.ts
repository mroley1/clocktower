
export namespace CTUUID {
    const usedUUIDs = new Set<string>()
    
    export function reset() {
        usedUUIDs.clear()
    }

    export function warmup(UUID: string) {
        usedUUIDs.add(UUID)
    }
    
    export function create() {
        let UUID = null;
        while (!UUID || usedUUIDs.has(UUID)) {
            UUID = window.crypto.randomUUID();
        }
        usedUUIDs.add(UUID);
        return UUID;
    }
}