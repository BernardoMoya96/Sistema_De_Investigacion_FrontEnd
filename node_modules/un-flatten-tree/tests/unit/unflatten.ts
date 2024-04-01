import * as bdd from 'intern!bdd';
import { unflatten } from '../../un-flatten-tree';
import * as expect from 'intern/chai!expect';
import Node from './Node';

bdd.describe('unflatten', () => {
    bdd.it('should convert an empty array to an empty array', () => {
        expect(unflatten([], () => true, null)).to.eql([]);
    });

    bdd.it('should convert list with parent ids to tree', function () {
        const tree = [
            {id: 3, items: [
                {id: 8, items: []}
            ]},
            {id: 2, items: [
                {id: 4, items: [
                    {id: 6, items: []},
                    {id: 5, items: [
                        {id: 7, items: []}
                    ]}
                ]}
            ]},
            {id: 1, items: []}
        ];

        const list = [
            {id: 8, pid: 3},
            {id: 3, pid: null},
            {id: 6, pid: 4},
            {id: 7, pid: 5},
            {id: 5, pid: 4},
            {id: 4, pid: 2},
            {id: 2, pid: null},
            {id: 1, pid: null}
        ];

        expect(
            unflatten(
                list,
                (node, parentNode) => node.pid === parentNode.id,
                (node, parentNode) => { (parentNode as any).items.push(node); },
                node => ({ id: node.id, items: [] })
            )
        ).to.eql(tree);
    });

    bdd.it('should convert list with parent ids to node tree', () => {
        const tree = [
            new Node('A'),
            new Node('B'),
            new Node('C', [
                new Node('D', [
                    new Node('E')
                ]),
                new Node('F')
            ])
        ];

        const list = [
            {id: 1, pid: null, name: 'A'},
            {id: 2, pid: null, name: 'B'},
            {id: 3, pid: null, name: 'C'},
            {id: 4, pid: 3, name: 'D'},
            {id: 5, pid: 4, name: 'E'},
            {id: 6, pid: 3, name: 'F'}
        ];

        expect(
            unflatten(
                list,
                (node, parentNode) => node.pid === parentNode.id,
                (node, parentNode: Node) => { parentNode.addChild(node); },
                node => new Node(node.name)
            )
        ).to.eql(tree);
    });

    bdd.it('should convert array-like object to tree', () => {
        const tree = [
            {id: 2, items: [
                {id: 4, items: [
                    {id: 6, items: []},
                    {id: 5, items: [
                        {id: 7, items: []}
                    ]}
                ]}
            ]},
            {id: 3, items: [
                {id: 8, items: []}
            ]},
            {id: 1, items: []}
        ];

        const list = {
            0: {id: 8, pid: 3},
            4: {id: 3, pid: null},
            1: {id: 6, pid: 4},
            5: {id: 7, pid: 5},
            2: {id: 5, pid: 4},
            6: {id: 4, pid: 2},
            3: {id: 2, pid: null},
            7: {id: 1, pid: null},
            length: 8
        };

        expect(
            unflatten(
                list,
                (node, parentNode) => node.pid === parentNode.id,
                (node, parentNode) => { (parentNode as any).items.push(node); },
                node => ({ id: node.id, items: []})
            )
        ).to.eql(tree);
    });

    bdd.it('should convert list to tree without converting nodes', function () {
        const tree = [
            {id: 3, pid: null, items: [
                {id: 8, pid: 3, items: [
                    {id: 2, pid: 8, items: [
                        {id: 1, pid: 2, items: []}
                    ]}
                ]}
            ]}
        ];

        const list = [
            {id: 8, pid: 3, items: []},
            {id: 3, pid: null, items: []},
            {id: 2, pid: 8, items: []},
            {id: 1, pid: 2, items: []}
        ];

        expect(
            unflatten(
                list,
                (node, parentNode) => node.pid === parentNode.id,
                (node, parentNode) => { parentNode.items.push(node); }
            )
        ).to.eql(tree);
    });
});
