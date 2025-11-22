function LogItem(options = {}) {
    const self = this;
    self.message = options.message || '';
    self.level = options.level || 1;
    self.timestamp = options.timestamp || new Date();
    self.location = options.location || '';
    self.action = options.action || '';
    self.application = options.application || ''; 
    self.service = options.service || '';
}

export { LogItem };