/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    ISSUED: 1,
    // RECEIVED: 2,
    BIDDING: 3,
    REDEEMED: 4,
    APPROVED: 5
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CommercialPaper extends State {

    constructor(obj) {
        super(CommercialPaper.getClass(), [obj.issuer, obj.paperNumber]);
        Object.assign(this, obj);
    }

    // Valuable
    setFaceValue(value) {
        this.faceValue = value
    }

    getFaceValue() {
        return this.faceValue
    }

    setBidValue(value) {
        this.bidValue = value
    }

    getBidValue() {
        return this.bidValue
    }

    setBidOpener(opener) {
        this.bidOpener = opener
    }

    getBidOpener() {
        return this.bidOpener
    }

    setBuyer(value) {
        this.buyer = value
    }

    getBuyer(value) {
        return this.buyer
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setIssued() {
        this.currentState = cpState.ISSUED;
    }

    setBidding() {
        this.currentState = cpState.BIDDING;
    }

    setRedeemed() {
        this.currentState = cpState.REDEEMED;
    }

    setApproved() {
        this.currentState = cpState.APPROVED;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isBidding() {
        return this.currentState === cpState.BIDDING;
    }

    isRedeemed() {
        return this.currentState === cpState.REDEEMED;
    }

    isApproved() {
        return this.currentState === cpState.APPROVED;
    }

    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue) {
        return new CommercialPaper({ issuer, paperNumber, issueDateTime, maturityDateTime, faceValue });
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
