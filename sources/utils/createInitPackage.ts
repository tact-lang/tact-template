import { beginCell, Cell, storeMessageRelaxed, storeStateInit } from "ton-core";

export function createInitPackage(init: { code: Cell, data: Cell }) {
    return beginCell()
        .store(storeStateInit(init))
        .endCell()
        .toBoc({ idx: false });
}