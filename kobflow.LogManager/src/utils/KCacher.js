function KCacher() {

    const self = this;


    self.get = function(key) {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (err) {
            console.error(`Failed to get cache for key ${key}:`, err);
        }
        return null;
    }

    self.set = function(key, value) {
        try {
            if(value === undefined || value ==="undefined")
            {console.warn(`Attempting to cache undefined value for key ${key}. This will not be cached.`); return;}
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error(`Failed to set cache for key ${key}:`, err);
        }
    }

}
export default KCacher;