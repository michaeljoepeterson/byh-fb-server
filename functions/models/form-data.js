const {BaseData} = require('./base-data');

class FormData extends BaseData{

    constructor(data){
        this.referralNum = null;
        this.referralType = null;
        this.otherReferralType = null;
        this.schoolDistrict = null;
        this.referralDate = null;
        this.contactTime = null;
        this.referralPer = null;
        this.referralTypeAndName = null;
        this.clientLocation = null;
        this.locationNeighbourhood = null;
        this.firstName = null;
        this.age = null;
        this.learnedAbout = null;
    }
}

module.exports = FormData;