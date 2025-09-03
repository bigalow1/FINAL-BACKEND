import User from '../models/user.js';   


exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', isApproved: false });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveVendor = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendor = await User.findOneAndUpdate(
      { _id: vendorId, role: 'vendor' },
      { isApproved: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found or not a vendor' });
    }

    res.json({ message: 'Vendor approved successfully', vendor });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
