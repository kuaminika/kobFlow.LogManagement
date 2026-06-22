function ListLoader({ context, kCourrier, endpoints, cacher }) {

    const self = this;

    // Reads the current cached list (or empty array if nothing cached yet)
    const getCachedList = function() {
        return (cacher && cacher.get(context)) || null;
    };

    // Central place where every write updates the cache the same way
    const mutateCache = function(updater) {
        if (!cacher) return;
        const current = getCachedList();
        if (current == null) return; // nothing cached yet, let next Load() fetch fresh
        const next = updater(current);
        cacher.set(context, next);
    };

    self.Load = async function({ forceRefresh = false, endpoint } = {}) {
        try {
            console.log("endpoints:",endpoints)
            const url = endpoint || endpoints.list;
            if (!forceRefresh) {
                const cacheHit = getCachedList();
                if (cacheHit && cacheHit.length >0) {
                    console.log(`Cache hit for context ${context}:`, cacheHit);
                    return cacheHit;
                }
            }

            console.log(`Cache miss for context ${context}. Fetching from server...`);
            const data = await kCourrier.get(url);
            const result = data.subject;

            if (cacher) {
                cacher.set(context, result);
            }

            return result;
        }
        catch (err) {
            console.log({"endpointSet":endpoints})
           console.error(`Failed to load list for context ${context}:`, {"endpointSet":endpoints},err);
            throw err; // let caller know it failed, instead of returning undefined
        }
    };

    self.delete = async function(item, { endpoint } = {}){
        try {

            const url = endpoint || endpoints.delete;
            const result = await kCourrier.post(url, {
                context: "Flows",
                requestAction: "delete",
                sourceContext: context,
                payLoad: item
            });
            console.log("delete result:", result);

            // Remove the item from cache on success
            mutateCache(list => list.filter(i => i.id !== item.id));

            return result;
        }
        catch (err) {
            console.error(`Failed to delete item with id ${item.id} for context ${context}:`, err);
            throw err;
        }
    };

    self.update = async function(item, { endpoint } = {}) {
        try {
            const url = endpoint || endpoints.update;
            const result = await kCourrier.post(url, {
                context: "Flows",
                requestAction: "update",
                sourceContext: context,
                payLoad: item
            });
            console.log("update result:", result);

            // Replace the item in cache, prefer server response if it returns the updated entity
            const updatedItem = result?.subject ?? item;
            mutateCache(list => list.map(i => i.id === updatedItem.id ? updatedItem : i));

            return result;
        }
        catch (err) {
            console.error(`Failed to update item with id ${item.id} for context ${context}:`, err);
            throw err;
        }
    };

    self.create = async function(item, { endpoint } = {}) {
        try {
            const url = endpoint|| endpoints.create;
            const result = await kCourrier.post(url, {
                context: "Flows",
                requestAction: "create",
                sourceContext: context,
                payLoad: item
            });
            console.log("create result:", result);

            const newItem = result?.subject ?? item;
            mutateCache(list => [...list, newItem]);

            return result.subject;
        }
        catch (err) {
            console.error(`Failed to create item for context ${context}:`, err);
            throw err;
        }
    };
}

export default ListLoader;