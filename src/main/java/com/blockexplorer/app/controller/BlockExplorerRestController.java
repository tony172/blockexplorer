package com.blockexplorer.app.controller;

import com.blockexplorer.app.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wf.bitcoin.javabitcoindrpcclient.BitcoinJSONRPCClient;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class BlockExplorerRestController {
    private static final String BLOCK = "block";
    private static final String TX    = "tx";
    private static final String NONE  = "none";
    BitcoinJSONRPCClient bitcoinClient = null;
    Optional<BitcoindRpcClient.Block> block = Optional.empty();
    Optional<BitcoindRpcClient.RawTransaction> transaction = Optional.empty();
    Optional<Integer> blockHeight  = Optional.empty();
    Optional<String> txOrBlockHash = Optional.empty();
    Optional<String> status         = Optional.empty();

    @Autowired
    ConfigProperties config;


    @PostMapping("/process")
    public Response processInput(@RequestParam String value) {
        System.out.println("Received: " + value);
        empty();
        connect();
        Response response = new Response();
        response.setStatus(NONE);

        if (value.length() == 64) {
            txOrBlockHash = Optional.of(value);
            if (bitcoinClient == null) {
                return response;
            }

            try {
                blockHeight = Optional.of(bitcoinClient.getBlock(value).height());
                status = Optional.of(BLOCK);
            } catch (Exception e) {
                status = Optional.of(NONE);
            }

            try {
                transaction = Optional.of(bitcoinClient.getRawTransaction(value));
                status = Optional.of(TX);

                TransactionInfo txInfo = new TransactionInfo();
                List<InputInfo> inputs = new ArrayList<>();
                List<OutputInfo> outputs = new ArrayList<>();

                transaction.get().vIn().forEach(input -> {
                    BitcoindRpcClient.RawTransaction.Out txOut;
                    try {
                        txOut = input.getTransactionOutput();
                    } catch (Exception e) {return;}
                    InputInfo inputInfo = new InputInfo();
                    inputInfo.setSequence(input.sequence());
                    inputInfo.setValue(txOut.value().doubleValue());
                    inputInfo.setScriptPubKey(txOut.scriptPubKey().hex());
                    inputInfo.setAddresses(txOut.scriptPubKey().addresses() == null ?
                            new ArrayList<>() : txOut.scriptPubKey().addresses());
                    inputs.add(inputInfo);
                });

                transaction.get().vOut().forEach(output -> {
                    OutputInfo outputInfo = new OutputInfo();
                    outputInfo.setN(output.n());
                    outputInfo.setValue(output.value().doubleValue());
                    outputInfo.setScriptPubKey(output.scriptPubKey().toString());
                    outputInfo.setScriptPubKey(output.scriptPubKey().hex());
                    outputInfo.setAddresses(output.scriptPubKey().addresses() == null ?
                            new ArrayList<>() : output.scriptPubKey().addresses());
                    outputInfo.setSpent(output.toInput().vout() != 0);
                    outputs.add(outputInfo);
                });

                if (inputs.size() == 0) {
                    InputInfo tmp = new InputInfo();
                    tmp.setAddresses(new ArrayList<>());
                    inputs.add(tmp);
                }
                if (outputs.size() == 0) {
                    OutputInfo tmp = new OutputInfo();
                    tmp.setAddresses(new ArrayList<>());
                    outputs.add(tmp);
                }
                txInfo.setInputs(inputs);
                txInfo.setOutputs(outputs);
                txInfo.setBlockHash(transaction.get().blockHash());
                try {
                    txInfo.setBlockHeight(bitcoinClient.getBlock(transaction.get().blockHash()).height());
                } catch (Exception e) {
                    txInfo.setBlockHeight(0);
                }

                txInfo.setConfirmations(transaction.get().confirmations() == null ? 0 : transaction.get().confirmations());
                txInfo.setSize(transaction.get().size());
                txInfo.setLockTime(transaction.get().lockTime());
                try {
                    txInfo.setTime(transaction.get().time().toString());
                } catch (Exception e) {
                    txInfo.setTime("unavailable");
                }
                txInfo.setTxId(transaction.get().txId());
                txInfo.setVersion(transaction.get().version());
                txInfo.setvSize(transaction.get().vsize());

                response.setStatus(TX);
                response.setTxInfo(txInfo);
                return response;
            } catch (Exception e) {
                status = Optional.of(NONE);
                e.printStackTrace();
            }
        }

        Integer height = 0;
        if (blockHeight.isPresent()) {
            height = blockHeight.get();
        } else {
            try {
                height = Integer.parseInt(value);
            } catch (Exception e) {
                return response;
            }
        }
        try {
            BitcoindRpcClient.Block block = bitcoinClient.getBlock(height);
            BlockInfo blockInfo = new BlockInfo();
            blockInfo.setDifficulty(block.difficulty().doubleValue());
            blockInfo.setNonce(block.nonce());
            blockInfo.setFullTime(block.time().toString());
            blockInfo.setMerkleRoot(block.merkleRoot());
            blockInfo.setTxIds(block.tx());
            blockInfo.setSize(block.size());
            blockInfo.setHeight(height);
            blockInfo.setConfirmations(block.confirmations());
            blockInfo.setHash(block.hash());

            Double totalInputs = 0.0;
            Double totalOutputs = 0.0;
            Double totalFee = 0.0;
            for (String txId : block.tx()) {
                BitcoindRpcClient.RawTransaction tx = bitcoinClient.getRawTransaction(txId);
                for (BitcoindRpcClient.RawTransaction.In in : tx.vIn()) {
                    try {
                        totalOutputs += in.getTransactionOutput().value().doubleValue();
                    } catch (Exception e) {}
                }
                for (BitcoindRpcClient.RawTransaction.Out out : tx.vOut()) {
                    totalInputs += out.value().doubleValue();
                }
            }
            totalFee = totalInputs - totalOutputs;
            blockInfo.setFee(totalFee);
            blockInfo.setAmount(totalOutputs);

            response.setStatus(BLOCK);
            response.setBlockInfo(blockInfo);
            return response;
        } catch (Exception e) {}

        status = Optional.of(NONE);
        response.setStatus(NONE);
        return response;
    }

    private BitcoinJSONRPCClient connect() {
        if (bitcoinClient == null) {
            String user = config.getUser();
            String password = config.getPassword();
            String host = config.getHost();
            Integer port = config.getPort();

            try {
                URL url = new URL("http://" + user + ':' + password + "@" + host + ":" + port + "/");
                bitcoinClient = new BitcoinJSONRPCClient(url);
                System.out.println("Connected to Bitcoin Core");
                return bitcoinClient;
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
        return bitcoinClient;
    }

    @PostMapping(path = "/latest10Transactions")
    public List<TransactionInfo> getLast10Transactions() {
        List<TransactionInfo> transactionInfos = new ArrayList<>();
        connect().getRawMemPool().stream().limit(10).forEach(txId -> {
            BitcoindRpcClient.RawTransaction transaction = bitcoinClient.getRawTransaction(txId);
            TransactionInfo txInfo = new TransactionInfo();
            txInfo.setTxId(transaction.txId());
            Double amount = 0.0;
            for (BitcoindRpcClient.RawTransaction.Out output : transaction.vOut()) {
                amount += output.value().doubleValue();
            }
            txInfo.setAmount(amount);
            transactionInfos.add(txInfo);
        });
        return transactionInfos;
    }

    @PostMapping(path = "/latest10Blocks")
    public List<BlockInfo> getLast10Blocks() {
        List<BlockInfo> blockInfos = new ArrayList<>();
        BitcoinJSONRPCClient client = connect();
        Integer latestBlock = client.getBlockCount();
        for (int i = latestBlock - 9; i < latestBlock + 1; i++) {
            BitcoindRpcClient.Block block = client.getBlock(i);
            BlockInfo blockInfo = new BlockInfo();
            blockInfo.setHeight(i);
            blockInfo.setSize(block.size());
            Date time = block.time();
            blockInfo.setTime(time.getHours() + ":" + (time.getMinutes() < 10 ?
                    "0" + time.getMinutes() : time.getMinutes())+ ":"
                    + (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()));
            blockInfos.add(blockInfo);
        }
        Collections.reverse(blockInfos);
        return blockInfos;
    }

    private void empty() {
        blockHeight = Optional.empty();
        txOrBlockHash = Optional.empty();
        status = Optional.empty();
    }
}
