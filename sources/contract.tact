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
    // empty receiver for deployment and receiving funds
    receive() {
        // return the amount to the sender
        cashback(sender());
    }

    receive(_: Increment) {
        self.add(1);

        // return the amount to the sender
        cashback(sender());
    }

    receive(msg: Add) {
        self.add(msg.amount);

        // return the amount to the sender
        cashback(sender());
    }

    fun add(v: Int) {
        self.requireOwner();
        self.counter += v;
    }

    get fun counter(): Int {
        return self.counter;
    }
}
