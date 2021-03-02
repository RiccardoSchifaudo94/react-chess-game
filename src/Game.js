import * as Chess from "chess.js";
import { BehaviorSubject } from 'rxjs';


const chess = new Chess();

export const gameSubject = new BehaviorSubject({
    board:chess.board()
});

export function initGame(){
    
    const savedGame = localStorage.getItem('savedGame');
    
    if(savedGame){
        chess.load(savedGame);
    }

    updateGame();
}

export function resetGame(){
    chess.reset();
    updateGame();
}

export function handleMove(from,to){
    const promotions = chess.moves({verbose:true}).filter(m => m.promotion);
    console.table(promotions);
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)){
        console.log("the user going to promote");
        const pendingPromotion = {from, to, color:promotions[0].color };
        updateGame(pendingPromotion);
    }
    const {pendingPromotion} = gameSubject.getValue();
    
    if(!pendingPromotion){
        move(from,to);
    }
    
}

export function move(from, to, promotion){
    
    console.log(from, to);

    let tempMove = {from, to};
    
    if(promotion){
        tempMove.promotion = promotion;
    }

    const legalMove = chess.move(tempMove);

    if(legalMove){
       console.log(chess.fen());
       updateGame();
    }
}   

function updateGame(pendingPromotion){
    const isGameOver = chess.game_over();

    const newGame = {
        board:chess.board(),
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    }
    
    localStorage.setItem('savedGame',chess.fen());

    gameSubject.next(newGame);
}

function getGameResult(){
    
    if(chess.in_checkmate()){
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE';
        return `CHECKMATE - WINNER - ${winner}`;
    }else if(chess.in_draw()){
        
        let reason = '50 - MOVES - RULE';
        
        if(chess.in_stalemate()){
            reason = 'STALEMATE';
        }else if(chess.in_threefold_repetition()){
            reason = 'REPETETION'
        }else if(chess.insufficientMaterial()){
            reason = 'INSUFFICIENT MATERIAL';
        }

        return `DRAW - ${reason}`;
    }else{
        return 'UNKNOWN REASON';
    }

}