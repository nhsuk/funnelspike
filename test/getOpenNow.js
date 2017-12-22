const chai = require('chai');
const moment = require('moment');
const funnelSearch = require('../lib/funnelSearch');

const latitude = 54.159074;
const longitude = -0.897925;
const expect = chai.expect;

describe('getOpenPharmacies', () => {
  it('should return pharmacies open now', async () => {
    const friday2pm = moment('2017-09-15 14:00:00');
    const result = await funnelSearch.getOpenPharmacies(friday2pm, { latitude, longitude }, 20, 10);
    expect(result.length).to.be.greaterThan(0);
  });

  it('should return nearby pharmacies', async () => {
    const result = await funnelSearch.getPharmacies({ latitude, longitude }, 20, 10);
    expect(result.length).to.be.greaterThan(0);
  });

  it('should return alteration pharmacies', async () => {
    const xmas2pm = moment('2017-12-25 14:00:00');
    const result = await funnelSearch.getAlterations(xmas2pm, { latitude, longitude });
    expect(result.length).to.be.greaterThan(0);
  });
});
