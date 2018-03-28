class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Rectangle{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    contains(point){
        return (point.x >= this.x - this.width &&
                point.x <= this.x + this.width &&
                point.y >= this.y - this.height &&
                point.y <= this.y + this.height)
    }
}


class QuadTree{
    constructor(boundary, capacity, levels, level){
        this.boundary = boundary;
        this.capacity = capacity;
        this.sections = {};
        this.subdivided = false;
        this.points = [];
        this.level = level || 0;
        this.levels = levels || 7;
        this.max_count = capacity * Math.pow(4, this.levels - this.level - 1);
    }
    
    count(){
        let total = this.points.length;
        for(let section in this.sections) {
            total += this.sections[section].count();
        }
        return total;
    }

    subdivide(point){
        if(this.level < this.levels - 1){
            let x = this.boundary.x;
            let y = this.boundary.y;
            let half_w = this.boundary.width * .5;
            let half_h = this.boundary.height * .5;
            let next_level = this.level + 1;
            
            //let 
            let nw = new Rectangle(x - half_w, y - half_h, half_w, half_h);
            let ne = new Rectangle(x + half_w, y - half_h, half_w, half_h);
            let se = new Rectangle(x + half_w, y + half_h, half_w, half_h);
            let sw = new Rectangle(x - half_w, y + half_h, half_w, half_h);
            
            this.sections.northwest = new QuadTree(nw, this.capacity, this.levels, next_level);
            this.sections.northeast = new QuadTree(ne, this.capacity, this.levels, next_level);
            this.sections.southeast = new QuadTree(se, this.capacity, this.levels, next_level);
            this.sections.southwest = new QuadTree(sw, this.capacity, this.levels, next_level);

            for(let section in this.sections) {
                for(let p of this.points) {
                    this.sections[section].insert(p);
                }
            }

            this.points = [];
            this.subdivided = true;
            return true;
        }
        return false;
    }

    insert(point){

        if(!this.boundary.contains(point))
            return false;

        if(this.points.length < this.capacity && !this.subdivided){
            this.points.push(point);
            return true;
        }
        else{
            if(!this.subdivided){
                if(!this.subdivide(point))
                    return false;
            }
            
            if(this.sections.northwest.insert(point) || 
                this.sections.northeast.insert(point) ||
                this.sections.southeast.insert(point) || 
                this.sections.southwest.insert(point)) {
                return true;
            }
        }
        return false;
    }
}