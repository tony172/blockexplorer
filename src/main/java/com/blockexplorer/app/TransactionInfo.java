package com.blockexplorer.app;

import java.util.List;

public class TransactionInfo {
    private String txId;
    private String blockHash;
    private Integer blockHeight;
    private Integer confirmations;
    private Long lockTime;
    private Long size;
    private String time;
    private Long vSize;
    private Integer version;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    private Double amount;
    List<InputInfo> inputs;
    List<OutputInfo> outputs;

    public String getTxId() {
        return txId;
    }

    public void setTxId(String txId) {
        this.txId = txId;
    }

    public String getBlockHash() {
        return blockHash;
    }

    public void setBlockHash(String blockHash) {
        this.blockHash = blockHash;
    }

    public Integer getBlockHeight() {
        return blockHeight;
    }

    public void setBlockHeight(Integer blockHeight) {
        this.blockHeight = blockHeight;
    }

    public Integer getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(Integer confirmations) {
        this.confirmations = confirmations;
    }

    public Long getLockTime() {
        return lockTime;
    }

    public void setLockTime(Long lockTime) {
        this.lockTime = lockTime;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getvSize() {
        return vSize;
    }

    public void setvSize(Long vSize) {
        this.vSize = vSize;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public List<InputInfo> getInputs() {
        return inputs;
    }

    public void setInputs(List<InputInfo> inputs) {
        this.inputs = inputs;
    }

    public List<OutputInfo> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<OutputInfo> outputs) {
        this.outputs = outputs;
    }
}
