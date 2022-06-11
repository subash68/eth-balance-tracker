const catchAsync = require('../utils/catchAsync');
const { trackerService } = require ('../services');

const configureTracker = catchAsync(async (req, res) => {
    const config = await trackerService.configTracker(req.body);
    res.json({status: true, config: config});
});

const startTracker = catchAsync(async (req, res) => {
    await trackerService.startTracker(req.body.name);
    res.json({status: true});
});

module.exports = {
    configureTracker,
    startTracker
}