function Kourrier() {
    const self = this;

    self.post = async function(fullURL, data, headerRules) {
        console.log("doing post with:", data, JSON.stringify(data));
        console.log("posting: " + fullURL);

        if (!headerRules || typeof headerRules !== 'object' || headerRules instanceof Map) {
            headerRules = { 'Content-Type': 'application/json' };
        }

        const postOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headerRules
        };

        const response = await fetch(fullURL, postOptions);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    };

    self.get = async function(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    };
}

const kCourrier = new Kourrier();
export { kCourrier };