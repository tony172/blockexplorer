package com.blockexplorer.app;

public class Response {
    private String status;
    TransactionInfo txInfo;

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
