const hashes = require('../services/hashes'),
    _ = require('lodash'),
    nis = require("../services/nisRequestService"),
    expect = require('chai').expect,
    Promise = require('bluebird');



describe('core/block processor', function () {

  
    it('check hash for simple block [just fake]',  () => {
        const block = {
            type: 1,
            version: -1744830463,
            timeStamp: 7,
            signer: "6ee7d0e2303a764ecb808150b641cafbf7a902ec0ad97d1c8bba7dc9350efc23",
            prevBlockHash: {data: "e95018e8de6aaa47d0f9187632e3021a4206fd7aa8270596744e57f9c8c9ef4c"},
            height: 3,
            transactions: []
        };

        const exampleHash = "b2aab76ddad0360eca538168e7bac4f26b738f3d2fc4445010735bbc78facd35";
        expect(hashes.calculateBlockHash(block)).to.be.equal(exampleHash);
    });

    it('check hash for simple transaction [just fake]',  () => {
        const transaction = {
            amount: 123000000,
            recipient: "TDYOO3HEHRCCMHRUG6C7INXV7HQP5CB3627EE5QD",
            fee: 100,
            version: -1744830463,
            timeStamp: 0,
            deadline: 0,
            signer: "ddf7105494117d97c7133aff5c1438bf1e2eaca593e42e27e9b0641da76d7298",
            type: 257,
            signature: "52ddec57d587d7f0f4e663d5ce654bec540ea75eecb572b0acd9afbe17a7cb5dbe5abde9468759af78729cba4aa5a44925afa530bb4b99c3f97f2bfbd2136b01"
        };
        const exampleHash = "8cb136e010b72b8cd57e9add81bf3ce7fba302c531e97cae5d15c3b06ec5304c";
        expect(hashes.calculateTransactionHash(transaction)).to.be.equal(exampleHash);
    });

    it('check hash for block with type mosaic supply change  [just fake]',  () => {
        const block =  { timeStamp: 94060511, 
            signature: "b28c03d1e646793cf1009abe41b3f170caafba240200361111d7830b54f322cd6162bcc4fc4847bcd9b9f36815e0fc0f2215349dfa682d787d340549bbd12904",
            prevBlockHash: { data: "9ddfaa761d99f0aa53f87db66adee6eb0b55aff387f6bf275167b7d85088149f" },
            type: 1,
            transactions: [ { 
                    "timeStamp": 9111526,
                    "signature": "651a19ccd09c1e0f8b25f6a0aac5825b0a20f158ca4e0d78f2abd904a3966b6e3599a47b9ff199a3a6e1152231116fa4639fec684a56909c22cbf6db66613901",
                    "fee": 150000,
                    "type": hashes.TRANSACTION_TYPES.MOSAIC_SUPPLY_CHANGE_TYPE,
                    "deadline": 9154726,
                    "version": -1744830463,
                    "signer": "d99e88c90da71a4b0d848454e59e296c9ef7a8f018f3eaa3a198dc460b6621a4",
                    "supplyType": 1,
                    "delta": 123,
                    "mosaicId": {
                        "namespaceId": "alice.vouchers",
                        "name": "gift vouchers"
                    }
            }], 
            version: -1744830463,
            signer: "f60ab8a28a42637062e6ed43a20793735c58cb3e8f3a0ab74148d591a82eba4d",
            height: 1386351 };
        
        const exampleHash = "13bfdaf443feca9cc926a6328e1ea87718ac8296330413cd27cf40f720418e31";
        expect(hashes.calculateBlockHash(block)).to.be.equal(exampleHash);
    });

    it('check hash for example live blocks for other types transactions in testnet', async () => {
        const exampleBlocks = {
            [hashes.TRANSACTION_TYPES.TRANSFER_TYPE]: [1, 1386351, 1385853], // 2 -with message 
            [hashes.TRANSACTION_TYPES.IMPORTANCE_TRANSFER_TYPE]: 	[1385732],
            [hashes.TRANSACTION_TYPES.MULTISIG_AGGREGATE_TYPE]: [1, 1386059], 
            [hashes.TRANSACTION_TYPES.MULTISIG_TYPE]: [1386224], 
            [hashes.TRANSACTION_TYPES.MULTISIG_SIGNATURE_TYPE]: [1384925], 
            [hashes.TRANSACTION_TYPES.PROVISION_NAMESPACE_TYPE]: [1386249],
            [hashes.TRANSACTION_TYPES.MOSAIC_DEFINITION_CREATION_TYPE]: [1386251],
            ['withoutTransactions']: [19,20]
        }

        const blockIds = _.reduce(exampleBlocks, (result, block) => _.merge(result, block), []);
        await Promise.map(blockIds, async(blockId) => {
            const block = await nis.getBlock(blockId);
            const blockCompare = await nis.getBlock(blockId+1);
            expect(hashes.calculateBlockHash(block)).to.be.equal(blockCompare.prevBlockHash.data);
        });
    });
});
  
  