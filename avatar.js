import p5 from 'p5'

export const modes = {
  TALK: 'talk',
  LISTEN: 'listen',
  IDLE: 'idle'
}

export class Avatar {
  constructor(options) {

    Object.assign(this, {
      parent: document.body,
      mode: modes.IDLE,
      color: 'red',
    }, options)

    this.setMode(this.mode)
    this.nArcs = 6;

    this.followRotation = 0


    this.p5 = new p5(p => {

      p.setup = () => {
        const cv = p.createCanvas(700, 410)
        resize()
        p.angleMode(p.DEGREES)
        cv.parent(this.parent)

        this.arcs = []
        for (let i = 0; i < this.nArcs; i++) {
          this.arcs.push(new Arc(p))
        }

      };

      p.draw = () => {

        const { width, height, mouseX, mouseY } = p

        resize()
        p.clear();
        p.fill(255);



        p.translate(width / 2, height / 2)
        p.push()
        p.rotate(this.followRotation)
        p.line(0, 0, 0, -100)
        p.pop()

        const nArcs = 6;
        const start = width / nArcs;
        const end = width / 2.5;

        p.noFill()
        // p.rotate(this.followRotation)
        p.stroke(this.color)

        this.arcs.forEach((arc, i) => {

          const amt = i / (nArcs - 1)

          arc.draw({
            sharp: p.lerp(0.2, 0.2, amt),
            thickness: this.thickness,
            radius: p.lerp(start, end, amt),
            leftMouth: this.leftMouth,
            rightMouth: this.rightMouth,
            rotation: this.rotation
          })
        })

        // p.rect(x, y, 50, 50);
      };

      const resize = () => {
        const { offsetWidth, offsetHeight } = this.parent
        p.resizeCanvas(offsetWidth, offsetHeight)
      }


    }); // invoke p5
  }

  follow(x, y) {
    const { left, top } = this.parent.getBoundingClientRect()

    // convert to local coordinates
    x = x - left - this.p5.width / 2
    y = y - top - this.p5.height / 2

    this.followRotation = this.p5.atan2(y, x) + 90
  }

  modulate(amt) {
    switch (this.mode) {
      case modes.TALK:
        this.rightMouth = amt
        break;
      case modes.LISTEN:
        this.rightMouth = amt
        this.leftMouth = amt
        this.rotation = this.p5.lerp(-90, 90, amt)
        break;
      case modes.IDLE:
    }
  }
  setMode(mode) {
    this.mode = mode

    switch (mode) {
      case modes.IDLE:
        this.leftMouth = 0
        this.rightMouth = 0
        this.thickness = 1
        this.rotation = 0
        break;
      case modes.TALK:
        this.leftMouth = 0
        this.rightMouth = 0.5
        this.thickness = 5
        this.rotation = 0
        break;
      case modes.LISTEN:
        this.leftMouth = 0.5
        this.rightMouth = 0.5
        this.thickness = 5
        this.rotation = 0
        break;
    }
  }


}

class Arc {
  constructor(p5) {
    this.p5 = p5

    this.leftMouth = 0
    this.rightMouth = 0
    this.thickness = 1
    this.sharp = 0.1
  }
  draw({ radius, thickness, leftMouth, rightMouth, sharp = 0.1, rotation }) {

    const { p5 } = this
    this.sharp = sharp;

    p5.push()


    const d = radius * 2

    p5.rotate(-90 + rotation * p5.noise(radius / 2))

    this.thickness = p5.lerp(this.thickness, thickness, this.sharp)
    this.leftMouth = p5.lerp(this.leftMouth, leftMouth, this.sharp)
    this.rightMouth = p5.lerp(this.rightMouth, rightMouth, this.sharp)

    p5.strokeWeight(this.thickness)

    // top
    p5.arc(0, 0, d, d, -90 * (1 - this.leftMouth), 90 * (1 - this.rightMouth));
    // bottom
    p5.arc(0, 0, d, d, 90 + 90 * (this.rightMouth), 270 - 90 * (this.leftMouth));
    p5.pop()
  }
}

