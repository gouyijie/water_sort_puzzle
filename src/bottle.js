let BLOCK_BLANK = 1;
let	BLOCK_UNKNOWN = 0;

class Bottle
{
	m_color = new Array();
	m_top = 0;
	m_blanks = 0;
	m_unknowns = 0;
	m_isOK = false;
	m_blocks = 4;
	
	constructor(blocks) {
		this.m_blocks = blocks;
	}	

	initBottle() {
		for (let i = 0; i < this.m_blocks; i++) {
			this.m_color.push(BLOCK_BLANK);
		}
		this.m_top = BLOCK_BLANK;
		this.m_blanks = this.m_blocks;
		this.m_unknowns = 0;
		this.m_isOK = false;
	}

	getState() {
		var state = '';
		if (this.m_isOK)
			return state;
		for (var char of this.m_color) {
			state += String.fromCharCode(char + 63);
		}
		return state;
	}
	//getState() {
	//	if (this.m_blocks == 1) {
	//		return String.fromCharCode(this.m_color[0]);
	//	}
	//	else {
	//		var state = new Array();

	//		for (var i = 0; i < this.m_color.length - 1; i += 2) {
	//			var char = String.fromCharCode(this.m_color[i] << 4 | this.m_color[i + 1]);
	//			state.push(char);
	//		}

	//		return state.join('');
	//	}
	//}

	getColor(index)
	{
		if (index >= 0 && index < this.m_blocks)
		{
			return this.m_color[index];
		}
		else
		{
			return null;
		}
	}

	empty()
	{
		return this.m_blanks == this.m_blocks;
	}

	blanks()
	{
		var bs = 0;
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] == BLOCK_BLANK)
				bs++;
			else
				return bs;
		}
		return bs;
	}

	unknowns()
	{
		var us = 0;
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] == BLOCK_UNKNOWN)
				us++;
		}
		return us;
	}

	isOK()
	{
		if ((this.m_blanks + this.m_unknowns) > 0) return false;

		for (var i = 1; i < this.m_blocks; i++)
		{
			if (this.m_color[i] != this.m_top)
				return false;
		}
		return true;
	}

	topColor()
	{
		for (var i = 0; i < this.m_blocks; i++)
		{
			if (this.m_color[i] != BLOCK_BLANK)
				return this.m_color[i];
		}
		return BLOCK_BLANK;
	}

	setColor(index, color)
	{
		if (index >= 0 && index < this.m_blocks)
			this.m_color[index] = color;
	}

	setTop(color)
	{
		if (color != BLOCK_BLANK && color != BLOCK_UNKNOWN)
		{
			for (var i = 0; i < this.m_blocks; i++)
			{
				if (this.m_color[i] != BLOCK_BLANK)
				{
					if (this.m_color[i] == BLOCK_UNKNOWN)
					{
						this.m_unknowns--;
					}
					this.setColor(i, color);
					this.m_top = color;
					if (i == 0 && this.m_unknowns == 0)
					{
						this.m_isOK = isOK();
					}
					return;
				}
			}
		}
	}

	// 鏄惁鍙互鍊掑嚭
	canPureOut()
	{
		return this.m_blanks < this.m_blocks && this.m_top != BLOCK_UNKNOWN ;	// 闈炵┖鐡�, 涓旈《閮ㄩ鑹插凡鐭ユ墠鍙€掑嚭
	}

	// 鏄惁鍙互鍊掑叆
	canPureIn(color)
	{
		if (this.empty())
		{
			return true;	// 绌虹摱褰撶劧鍙互鍊掑叆
		}
		else
		{
			return this.m_blanks > 0 && this.m_top == color;	// 鏈夌┖浣嶏紝涓旈《閮ㄩ鑹茬鍚堣鍊掑叆鐨勯鑹�
		}
	}

	canPureTo(other)
	{
		if (this.isSameColor())
		{
			// 鎶婁竴涓悓鑹茬摱鍊掑叆涓€涓┖鐡惰櫧鐒跺彲鎿嶄綔锛屼絾鏄釜搴熸搷浣�
			if (other.empty())	
				return false;
			
			return other.canPureIn(this.m_top);
		}
		else
		{
			return this.canPureOut() && other.canPureIn(this.m_top);
		}
	}

	isSameColor()
	{
		if (this.m_top == BLOCK_BLANK) return true;	// 姝や箖绌虹摱锛屽綋鐒朵篃绠楀悓鑹�
		if (this.m_top == BLOCK_UNKNOWN) return false;	// 椤堕儴鏈煡鍧楋紝褰撶劧涔熶笉鑳界畻鍚岃壊

		let c = this.m_color[this.m_blocks-1];
		for (var i = this.m_blocks - 2; i >= 0; i--)
		{
			let oc = this.m_color[i];
			if (oc == BLOCK_BLANK)
				return true;
			else if (oc != c)
				return false;
		}
		return true;
	}

	pureTo(other) {
		if (this.canPureTo(other)) {
			const top = this.m_top;
			while (other.m_blanks > 0 && this.m_top == top) {
				other.m_blanks--;
				other.setColor(other.m_blanks, this.m_top);
				this.setColor(this.m_blanks, BLOCK_BLANK);
				this.m_blanks++;
				this.m_top = this.m_blanks >= this.m_blocks ? BLOCK_BLANK : this.getColor(this.m_blanks);
			}
			other.m_top = top;
			other.m_isOK = other.isOK();
			this.m_isOK = false;	// 鍊掑嚭浜嗘按锛岃偗瀹氫笉婊′簡
		}
	}

	//pureTo(other)
	//{
	//	while (this.canPureTo(other))
	//	{	
	//		if (other.m_blanks > 0)
	//		{
	//			other.m_blanks--;
	//			other.setColor(other.m_blanks, this.m_top);
	//			other.m_top = this.m_top;

	//			this.setColor(this.m_blanks, BLOCK_BLANK);
	//			this.m_blanks++;
	//			this.m_isOK = false;	// 鍊掑嚭浜嗘按锛岃偗瀹氫笉婊′簡
	//		}
	//		else
	//		{
	//			// 閿欒
	//			return;
	//		}
	//		this.m_top = this.topColor();
	//	}
	//	other.m_isOK = other.isOK();
	//	return;
	//}

	pureBlocksTo(other, blocks)
	{
		//assert(other.m_blanks >= blocks);
		//assert(blocks > 0 && blocks < 4);
		var color = this.m_top;
		for (var i = 0; i < blocks; i++)
		{
			other.set(--other.m_blanks, color);
			this.setColor(this.m_blanks++, BLOCK_BLANK);
		}
		this.m_top = this.topColor();
		this.m_isOK = false;	// 鍊掑嚭浜嗘按锛岃偗瀹氫笉婊′簡

		other.m_top = other.topColor();
		other.m_isOK = other.isOK();
	}
	
	Update()
	{
		this.m_top = this.topColor();
		this.m_blanks = this.blanks(); 
		this.m_unknowns = this.unknowns();
		this.m_isOK = this.isOK();
	}

};

function clone(obj)
{
	var o;
	if (typeof obj == "object")
	{
		if (obj === null)
		{
			o = null;
		}
		else
		{
			if (obj instanceof Array)
			{
				o = [];
				for (var i = 0, len = obj.length; i < len; i++)
				{
					o.push(clone(obj[i]));
				}
			}
			else
			{
				o = Object.create(obj);
				for (var j in obj)
				{
					o[j] = clone(obj[j]);
				}
			}
		}
	}
	else
	{
		o = obj;
	}
	return o;
}

// problem鍖呮嫭浠ヤ笅鎴愬憳
//   rows锛屾樉绀虹殑琛屾暟
//   cols, 鏁扮粍锛屾瘡琛屾樉绀虹殑鐡跺瓙鏁�
//   color锛屾暟缁勶紝浣跨敤鐨勯鑹�
//   bottles锛屾暟缁勶紝鎵€鏈夌殑鐡跺瓙锛孊ottle

function GetColors(problem)
{
	var colors = [];
	
	for (var bottle of problem.bottles)
	{
		for (var i = 0; i < bottle.m_blocks; i++)
		{
			var index = bottle.getColor(i);
			if (index != BLOCK_BLANK && index != BLOCK_UNKNOWN)
			{
				var find = colors.findIndex(function(item, id, arr){
  				return item.index === index;
				});
				if (find != -1)
				{
					colors[find].count++;
				}
				else
				{
					var color = { 'index': index, 'count': 1 };
					colors.push(color);
				}
			}
		}
	}
	return colors;
}

function GetBlanks(problem)
{
	var blanks = 0;
	for (var bottle of problem.bottles)
	{
		if (bottle.m_blocks == 4)
			blanks += bottle.m_blanks;
	}
	return blanks;
}

function GetFullBottles(problem) {
	var bottles = 0;
	for (var bottle of problem.bottles) {
		if (bottle.m_blocks == 4)
			bottles ++;
	}
	return bottles;
}

function GetUnknowns(problem)
{
	var unknowns = 0;
	for (var bottle of problem.bottles)
	{
		unknowns += bottle.m_unknowns;
	}
	return unknowns;
}

function GetState(problem)
{
	var stateArray = new Array();
	for (var P of problem.bottles)
	{
		if (!(P.m_isOK || P.empty()))
			stateArray.push(P.getState());
	}
	stateArray.sort(function (a, b) { return a.localeCompare(b); });
	return stateArray.join('');
}

var g_allState = new Set();

function InitSet(state) {
	g_allState.clear();
	g_allState.add(state);
}

function IsDuplicateState(state) {
	if (g_allState.has(state)) {
		return true;
	}
	else {
		g_allState.add(state);
		return false;
    }
}

function IsDuplicateProblem(problem) {
	let state = GetState(problem);
	return IsDuplicateState(state);
}

function CheckProblem(problem)
{
	let blanks = GetBlanks(problem);
	//if (blanks <= 0 || blanks % 4) return false;	// 娌℃湁绌轰綅锛屾垨鑰呯┖浣嶄笉鏄�4鐨勬暣鏁板€�
	
	let bottles = GetFullBottles(problem);
	let colors = GetColors(problem);
	let unknowns = GetUnknowns(problem);

	if (unknowns < 4)
	{
		// 鍙湁鏈煡鍧楀皬浜�4鏃讹紝鎵嶈兘妫€鏌ラ鑹叉€绘暟鏄惁鍚堥€�
		//var colorCount = colors.length;
		//if (colorCount + blanks / 4 != bottles) return false;

		let lackColorBlocks = 0;
		for (var color of colors)
		{
			if (color.count > 4) {
				ShowStatus('鏈夐鑹茬殑鏁扮洰锛坽color.count}锛夊ぇ浜�4');
				return false;
			}
			else
			{
				lackColorBlocks += 4 - color.count;
			}
		}
		if (unknowns != lackColorBlocks)
		{
			ShowStatus('鏈煡棰滆壊鐨勫潡鏁扮洰涓嶅');
			return false;
		}
	}
	else
	{
		// 棰滆壊杩囧鏄剧劧鏄笉瀵圭殑
		if (colors.length + Math.floor(blanks / 4) > bottles) return false;

		var colorBlocks = 0;
		for (var color of colors)
		{
			// 鍗曚釜棰滆壊鐨勫潡鏁颁笉鑳借秴杩�4
			if (color.count > 4)
			{
				ShowStatus('鏈夐鑹茬殑鏁扮洰锛�${color.count}锛夊ぇ浜�4');
				return false;
			}
			colorBlocks += color.count;
		}
		
		if (unknowns + blanks + colorBlocks != bottles * 4)
			return false;
	}
	return true;
}

function cloneProblem(problem) {
	let cloned = { rows: problem.rows, color: problem.color, bottles: [] };
	for (var bottle of problem.bottles) {
		let b = new Bottle(4);
		b.m_color = bottle.m_color.slice();
		b.m_top = bottle.m_top;
		b.m_blanks = bottle.m_blanks;
		b.m_unknowns = bottle.m_unknowns;
		b.m_isOK = bottle.m_isOK;
		b.m_blocks = bottle.m_blocks;
		cloned.bottles.push(b);
	}
	return cloned;
}

// 妫€鏌ユ槸鍚﹀凡缁忓畬鎴�
function IsSolved(problem)
{
	let size = problem.bottles.length;
	for (var i = 0; i < size; i++)
	{
		if (problem.bottles[i].m_ok || problem.bottles[i].isSameColor() || problem.bottles[i].m_blanks == problem.bottles[i].m_blocks)
			continue;
		else
			return false;
	}
	return true;
}

function FinishPure(problem, pure) {
	let bottles = problem.bottles;
	for (var i = 0; i < bottles.length - 1; i++) {
		if (!bottles[i].m_isOK && bottles[i].isSameColor()) {
			for (var j = i + 1; j < bottles.length; j++) {
				if (bottles[j].canPureTo(bottles[i])) {
					bottles[j].pureTo(bottles[i]);
					pure.push({ 'from': j, 'to': i });
				}
			}
		}
	}
}
function FindPossibleNext(problem, nextDeep)
{
	let bottles = problem.problem.bottles;
	for (var i = 0; i < bottles.length; i++) {
		if (!bottles[i].m_isOK) {
			for (var j = 0; j < bottles.length; j++) {
				if (j !== i) {
					if (bottles[i].canPureTo(bottles[j])) {
						let newProblem = cloneProblem(problem.problem);
						newProblem.bottles[i].pureTo(newProblem.bottles[j]);
						if (!IsDuplicateProblem(newProblem)) {
							var pure = problem.pure.slice();//clone(problem.pure);	//鍔犻€�
							pure.push({ 'from': i, 'to': j });
							if (IsSolved(newProblem)) {
								FinishPure(newProblem, pure);
								return pure;
							}
							else {
								nextDeep.push({ 'problem': newProblem, 'pure': pure });
							}
						}
					}
				}
			}
		}
	}

	return null;
}

function SolveDeep(problemList, deep)
{
	var nextDeep = new Array();
	for (var problem of problemList)
	{
		let find = FindPossibleNext(problem, nextDeep);
		if (find !== null) {
			return find;
        }
	}
	if (nextDeep.length > 0)
		return SolveDeep(nextDeep, deep + 1);
	else
		return null;
}

function Solve(problem)
{
	var nextDeep = [{ 'problem': problem, 'pure': new Array() }];
	var state = GetState(problem);
	InitSet(state);
	return SolveDeep(nextDeep, 1);
}

function FindMoreUnkonwns(problem)
{
	var best = {'pure': new Array(), 'score' : -10000, 'oks': 0};
	var nextDeep = [{ 'problem': problem, 'pure': new Array() }];
	var state = GetState(problem);
	InitSet(state);
	FindMoreUnkonwnsDeep(nextDeep, best);
	return best;
}

function PrepareToEvaluation(problem)
{
	let bottles = problem.bottles;
	let pured = false;
	do {
		pured = false;
		for (var i = 0; i < bottles.length; i++) {
			if (!bottles[i].m_isOK && bottles[i].isSameColor() && bottles[i].m_top != BLOCK_BLANK && bottles[i].m_top != BLOCK_UNKNOWN) {
				// 鍚岃壊鏈弧鐡�
				for (var j = 0; j < bottles.length; j++) {
					if (i != j && bottles[j].m_top == bottles[i].m_top) {
						problem.bottles[j].pureTo(problem.bottles[i]);
						pured = true;
					}
				}
			}
		}
	} while (pured);
}

function Evaluation(problem)
{
	let bottles = problem.bottles;
	let score = 0;
	for (var i = 0; i < bottles.length; i++) {
		if (bottles[i].m_isOK)
			score += 10;
		else
		{
			switch (bottles[i].m_blanks) {
				case 1:
					score += 5;
					break;
				case 2:
					score -= 5;
					break;
				case 3:
					score -= 10;
					break;
				case 4:
					score += 10;
					break;
			}
		}
	}
	return score;
}

function FindPossibleNextWithUnknown(problem, nextDeep, best)
{
	let bottles = problem.problem.bottles;
	for (var i = 0; i < bottles.length; i++) {
		if (!bottles[i].m_isOK) {
			for (var j = 0; j < bottles.length; j++) {
				if (j !== i) {
					if (bottles[i].canPureTo(bottles[j])) {
						let newProblem = cloneProblem(problem.problem);
						newProblem.bottles[i].pureTo(newProblem.bottles[j]);
						if (!IsDuplicateProblem(newProblem)) {
							var pure = problem.pure.slice();
							pure.push({ 'from': i, 'to': j });
							if (newProblem.bottles[i].m_top == BLOCK_UNKNOWN) {
								// 缈诲嚭浜�1涓湭鐭ュ潡
								PrepareToEvaluation(newProblem);
								var score = Evaluation(newProblem);
								var oks = 0;
								for (var k = 0; k < newProblem.bottles.length; k++) {
									if (newProblem.bottles[k].m_isOK)
										oks++;
								}
								if (best.score < score || 
									(best.score == score && best.oks < oks)) {
									best.score = score
									best.pure = pure;
									best.oks = oks;
								}
							}
							else {
								nextDeep.push({ 'problem': newProblem, 'pure': pure });
							}
						}
					}
				}
			}
		}
	}
}

function FindMoreUnkonwnsDeep(problemList, best)
{
	var nextDeep = new Array();
	for (var problem of problemList)
	{
		FindPossibleNextWithUnknown(problem, nextDeep, best);
	}
	if (nextDeep.length > 0)
		FindMoreUnkonwnsDeep(nextDeep, best);
}

function FixQuestionMark(problem) {
	let unknowns = GetUnknowns(problem);
	if (unknowns === 1) {
		// 瀵逛簬鍙湁涓€涓棶鍙风殑锛屾槸鍙互鎵惧嚭鏉ュ畠搴旇鏄暐棰滆壊鐨勫摝
		let colors = GetColors(problem);
		let colorUnknown = 0;
		for (var color of colors) {
			if (color.count < 4) {
				colorUnknown = color.index;
				break;
			}
		}
		for (var bottle of problem.bottles) {
			for (var i = 0; i < bottle.m_blocks; i++) {
				var index = bottle.getColor(i);
				if (index == BLOCK_UNKNOWN) {
					bottle.setColor(i, colorUnknown);
					bottle.Update();
				}
			}
		}
		return true;
	}
	else
		return false;
}

// 鏈夊皯閲忛棶鍙凤紝璇曞浘鎵惧嚭涓€瀹氳兘瑙ｅ嚭鏉ョ殑
function TrySolve(problem)
{
	
}