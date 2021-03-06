/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialPaper = require('./paper.js');
const PaperList = require('./paperlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new CommercialPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} buyer paper buyer to redeem redeem
     * @param {String} issueDateTime paper issue date
     * @param {String} maturityDateTime paper maturity date
     * @param {Integer} faceValue face value of paper
    */
    async issue(ctx, issuer, paperNumber, buyer, issueDateTime, maturityDateTime, faceValue) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue);

        // Smart contract, rather than paper, moves paper into ISSUED state
        paper.setIssued();

        // Paper need to know the buyer
        paper.setBuyer(buyer);

        // Newly issued paper is owned by the buyer
        paper.setOwner(buyer);

        // Valuable
        paper.setFaceValue(faceValue)
        paper.setBidValue(faceValue)

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper.toBuffer();
    }

    /**
     * Buyer approve the paper
     * 
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {*} currentOwner Buyer identify themself
     */
    async approve(ctx, issuer, paperNumber, currentOwner) {
        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First check and moves state from ISSUED to APPROVED
        if (paper.isIssued()) {
            paper.setApproved();
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not issued. Current state = ' +paper.getCurrentState());
        }

        paper.setOwner(issuer)

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    async openBid(ctx, issuer, paperNumber, currentOwner) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First check and moves state from APPROVED to BIDDING
        if (paper.isApproved()) {
            paper.setBidding();
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not approved. Current state = ' +paper.getCurrentState());
        }

        paper.setBidOpener(currentOwner)
        paper.setBidValue(0)

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    async makeBid(ctx, issuer, paperNumber, bidder, bidPrice) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate bid price
        if (parseInt(paper.getBidValue()) >= parseInt(bidPrice)) {
            throw new Error('Paper ' + issuer + paperNumber + ' has current bidding at ' + paper.getBidValue());
        }

        // First check  BIDDING
        if (!paper.isBidding()) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not bidding. Current state = ' +paper.getCurrentState());
        }

        paper.setOwner(bidder)
        paper.setBidValue(bidPrice)

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    async closeBid(ctx, issuer, paperNumber, bidOpener) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current opener
        if (paper.getBidOpener() !== bidOpener) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not open by ' + bidOpener);
        }

        // First check  BIDDING
        if (!paper.isBidding()) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not bidding. Current state = ' +paper.getCurrentState());
        }

        paper.setApproved()

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * Redeem commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} redeemingOwner redeeming owner of paper
     * @param {String} redeemDateTime time paper was redeemed
    */
    async redeem(ctx, issuer, paperNumber, redeemingOwner, redeemDateTime) {

        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);

        let paper = await ctx.paperList.getPaper(paperKey);

        // Check paper is not APPROVED
        if (!paper.isApproved()) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not approved');
        }

        // Verify that the redeemer owns the commercial paper before redeeming it
        if (paper.getOwner() === redeemingOwner) {
            paper.setOwner(paper.getBuyer());
            paper.setRedeemed();
        } else {
            throw new Error('Redeeming owner does not own paper' + issuer + paperNumber);
        }

        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

}

module.exports = CommercialPaperContract;
