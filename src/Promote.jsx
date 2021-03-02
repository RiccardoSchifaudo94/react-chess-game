import React from 'react';
import Square from './Square';

const promotionPieces = ['r','n','b','q'];

export default function Promote({promotion:{from,to,color}}) {
    return (
        <div className="board">
            {promotionPieces.map((p,i)=>(
                <div key={i} className="promote-square">
                    <Square black={i%3===0}>
                        <div className="piece-container">
                            <img src={require(`./assets/${p}_${color}.png`).default} alt="" className="piece"/>
                        </div>
                    </Square>
                </div>
            ))}
        </div>
    )
}
