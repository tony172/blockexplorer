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

        if (value.length() == 64) {
            txOrBlockHash = Optional.of(value);
            if (bitcoinClient == null) {
                status = Optional.of(NONE);
                return null;
            }

            try {
                block = Optional.of(bitcoinClient.getBlock(value));
                status = Optional.of(BLOCK);
                return null;
            } catch (Exception e) {
                status = Optional.of(NONE);
                e.printStackTrace();
            }

            try {
                transaction = Optional.of(bitcoinClient.getRawTransaction(value));
                status = Optional.of(TX);

                TransactionInfo txInfo = new TransactionInfo();
                List<InputInfo> inputs = new ArrayList<>();
                List<OutputInfo> outputs = new ArrayList<>();

                transaction.get().vIn().forEach(input -> {
                    InputInfo inputInfo = new InputInfo();
                    inputInfo.setSequence(input.sequence());
                    inputInfo.setValue(input.getTransactionOutput().value().doubleValue());
                    inputInfo.setScriptPubKey(input.scriptPubKey());
                    inputInfo.setAddresses(input.getTransactionOutput().scriptPubKey().addresses());
                    inputs.add(inputInfo);
                });

                transaction.get().vOut().forEach(output -> {
                    OutputInfo outputInfo = new OutputInfo();
                    outputInfo.setN(output.n());
                    outputInfo.setValue(output.value().doubleValue());
                    outputInfo.setScriptPubKey(output.scriptPubKey().toString());
                    outputInfo.setAddresses(output.scriptPubKey().addresses());
                    outputInfo.setSpent(output.toInput().vout() != 0);
                    outputs.add(outputInfo);
                });

                txInfo.setInputs(inputs);
                txInfo.setOutputs(outputs);
                txInfo.setBlockHash(transaction.get().blockHash());
                txInfo.setConfirmations(transaction.get().confirmations());
                txInfo.setSize(transaction.get().size());
                txInfo.setLockTime(transaction.get().lockTime());
                txInfo.setTime(transaction.get().time().toString());
                txInfo.setTxId(transaction.get().txId());
                txInfo.setVersion(transaction.get().version());
                txInfo.setvSize(transaction.get().vsize());

                response.setStatus(TX);
                response.setTxInfo(txInfo);


                System.out.println("#######\n");
                transaction.get().vIn().forEach(in -> System.out.println(in.getTransactionOutput().scriptPubKey() +"\n"));

                System.out.println("####### out\n");
                transaction.get().vOut().forEach(in -> System.out.println(in.toInput().vout() +"\n"));

                return response;
            } catch (Exception e) {
                status = Optional.of(NONE);
                e.printStackTrace();
            }
        }

        try {
            blockHeight = Optional.of(Integer.parseInt(value));
            status = Optional.of(BLOCK);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }

        status = Optional.of(NONE);
        return null;
    }

    private void connect() {
        if (bitcoinClient == null) {
            String user = config.getUser();
            String password = config.getPassword();
            String host = config.getHost();
            Integer port = config.getPort();

            try {
                URL url = new URL("http://" + user + ':' + password + "@" + host + ":" + port + "/");
                bitcoinClient = new BitcoinJSONRPCClient(url);
                System.out.println("Connected to Bitcoin Core");
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
    }

    private void empty() {
        blockHeight = Optional.empty();
        txOrBlockHash = Optional.empty();
        status = Optional.empty();
    }
}
