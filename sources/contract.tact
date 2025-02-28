import "@stdlib/ownable";

message(0x1) Increment {
    // empty message
}

message(0x2) Add {
    amount: Int as uint32;
}

contract SampleTactContract(
    owner: Address,
    counter: Int as uint32,
) with Ownable {

    // empty receiver for deployment
    receive() {
        // cashback
        message(MessageParameters {
            to: sender(),
            mode: SendRemainingValue,
            value: 0,
            bounce: false,
        });
    }

    receive(_: Increment) {
        self.add(1);
    }

    receive(msg: Add) {
        self.add(msg.amount);
    }

    fun add(v: Int) {
        self.requireOwner();
        self.counter += v;
    }

    get fun counter(): Int {
        return self.counter;
    }
}
