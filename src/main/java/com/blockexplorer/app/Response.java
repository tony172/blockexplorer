package com.blockexplorer.app;

public class Response {
    String status;
    TransactionInfo txInfo;
    BlockInfo blockInfo;

    public BlockInfo getBlockInfo() {
        return blockInfo;
    }

    public void setBlockInfo(BlockInfo blockInfo) {
        this.blockInfo = blockInfo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public TransactionInfo getTxInfo() {
        return txInfo;
    }

    public void setTxInfo(TransactionInfo txInfo) {
        this.txInfo = txInfo;
    }
}
