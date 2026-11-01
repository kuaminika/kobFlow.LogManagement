function MerchantMapping(args)
{
    const self = this;
    args = args || {};
    self.id = args.id|| null;
    self.phrase = args.phrase|| null;
    self.targetKey = args.targetKey|| null;
    self.merchantId = args.merchantId|| null;
}

export default MerchantMapping;