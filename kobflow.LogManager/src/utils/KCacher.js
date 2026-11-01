function KCacher() {

    const self = this;

    const INDEX_KEY = "__kcacher_index__";
    let DEFAULT_TTL_MS = 90 * 60 * 1000; 

    // --- internal helpers ---

    function loadIndex() {
        try {
         
            const raw = localStorage.getItem(INDEX_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error("Failed to load KCacher index:", err);
            return [];
        }
    }

    function saveIndex(keys) {
        try {
            localStorage.setItem(INDEX_KEY, JSON.stringify(keys));
        } catch (err) {
            console.error("Failed to save KCacher index:", err);
        }
    }

    function addToIndex(key) {
        const keys = loadIndex();
        if (!keys.includes(key)) {
            keys.push(key);
            saveIndex(keys);
        }
    }

    function removeFromIndex(key) {
        const keys = loadIndex().filter(k => k !== key);
        saveIndex(keys);
    }

    // --- public API ---
    self.setDefaultTTL_Hours = function(hours)
    {
        DEFAULT_TTL_MS = hours *60 * 60 * 1000; 

    }
    self.get = function(key) {
        try {
         
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const parsed = JSON.parse(cached);

            // Backward compatibility: if it's not our wrapper shape, just return it as-is
            if (!parsed || typeof parsed !== "object" || !("__kcacher" in parsed)) {
                return parsed;
            }

            if (parsed.expiry !== null && Date.now() > parsed.expiry) {
                // expired -> clean up and return null
                localStorage.removeItem(key);
                removeFromIndex(key);
                return null;
            }

            return parsed.value;
        } catch (err) {
            console.error(`Failed to get cache for key ${key}:`, err);
        }
        return null;
    }

    
    self.listEntries = function () {
        const keys = loadIndex();
 
        const now = Date.now();
        return keys
        .map((key) => {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            let expiry = null;
            let sizeBytes = raw.length;
            try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object" && "__kcacher" in parsed) {
                    expiry = parsed.expiry;
            }
            } catch {
            // leave expiry null
            }
            return {
                key,
                sizeBytes,
                expiry,
                expired: expiry !== null && now > expiry,
            };
        })
        .filter(Boolean);
    };
    self.set = function(key, value, ttlMs = DEFAULT_TTL_MS) {
        try {
          
            if (value === undefined || value === "undefined") {
                console.warn(`Attempting to cache undefined value for key ${key}. This will not be cached.`);
                return;
            }

            const wrapped = {
                __kcacher: true,
                value: value,
                expiry: (ttlMs === null || ttlMs === undefined) ? null : Date.now() + ttlMs
            };

            localStorage.setItem(key, JSON.stringify(wrapped));
            addToIndex(key);
        } catch (err) {
            console.error(`Failed to set cache for key ${key}:`, err);
        }
    }

    self.remove = function(key) {
        try {
            localStorage.removeItem(key);
            removeFromIndex(key);
        } catch (err) {
            console.error(`Failed to remove cache for key ${key}:`, err);
        }
    }

    self.clearCache = function() {
        try {
            const keys = loadIndex();
            keys.forEach(key => localStorage.removeItem(key));
            localStorage.removeItem(INDEX_KEY);
        } catch (err) {
            console.error("Failed to clear cache:", err);
        }
    }

    // Optional: purge only expired entries without wiping everything
    self.purgeExpired = function() {
        const keys = loadIndex();
        keys.forEach(key => {
            self.get(key); // get() already evicts expired entries as a side effect
        });
    }
}

export default KCacher;