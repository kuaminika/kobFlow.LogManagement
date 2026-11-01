// In-memory stand-in for ListLoader, used until the real endpoint exists.
// Same methods and return shapes, so pages can't tell the difference.
function FakeListLoader({ seed = [] } = {}) {
    const self = this;
    let items = seed.map(i => ({ ...i }));
    console.log("FakeListLoader seed:", seed);
    let nextId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1;

    self.Load = async () => items.map(i => ({ ...i }));

    self.create = async (item) => {
        const created = { ...item, id: nextId++ };
        items.push(created);
        return created;                      // ListLoader.create returns the new item
    };

    self.update = async (item) => {
        items = items.map(i => (i.id === item.id ? { ...item } : i));
        return { subject: { ...item } };     // ListLoader.update returns { subject }
    };

    self.delete = async (item) => {
        items = items.filter(i => i.id !== item.id);
        return { subject: item };
    };
}

export default FakeListLoader;