class ScheduleCanvas
     { constructor(canvasID, { startHour=8, endHour=18,
                               blockWidth=100, blockHeight=60,
                               marginX=50, marginY=50,
                               background='#fff', foreground='#000',
                               guideOpacity=0.2, lineHeight=14, textPadding=5, font='12px Arial',
                               shortDays=['mo', 'tu', 'we', 'th', 'fr'], longDays=['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}={})
            {
                   { this.startHour = startHour; this.endHour = endHour; this.blockWidth = blockWidth; this.blockHeight = blockHeight;
                     this.marginX = marginX; this.marginY = marginY; this.background = background; this.foreground = foreground;
                     this.guideOpacity = guideOpacity; this.lineHeight = lineHeight; this.textPadding = textPadding;
                     this.font = font; this.shortDays = shortDays; this.longDays = longDays }

              this.canvas = document.getElementById(canvasID)
              this.canvas.width = marginX + longDays.length*blockWidth
              this.canvas.height = marginY + (endHour - startHour + 1) * blockHeight

              this.c = this.canvas.getContext('2d')
              this.c.globalAlpha = 1
              this.c.font = font
              this.c.strokeStyle = foreground
              this.c.textAlign = 'center'
              this.c.textBaseline = 'middle'

              this.clear() }

       clear()
            { this.c.clearRect(0, 0, this.canvas.width, this.canvas.height) }

       drawSchedule(text)
            { window.requestAnimationFrame(() => this.drawScheduleCallback(text)) }

       drawScheduleCallback(text)
            { this.clear()
              this.drawTimes()
              this.drawDOWLabels()
              this.drawLines()
              for (let chunk of text.split('\n\n'))
                   { let lines = chunk.split('\n')
                     for (let dow of lines[0].toLowerCase().split(/(?=(?:..)*$)/)) // splits mowefrtu into mo, we, fr, tu
                            for (let block of lines.slice(1, lines.length).map(parseBlock)) // takes remaining lines and parses them into blocks
                                   if (this.shortDays.indexOf(dow) != -1)
                                          this.drawTextRect(block[0],
                                                            this.marginX + this.shortDays.indexOf(dow)*this.blockWidth,
                                                            this.marginY + (block[1] - this.startHour)*this.blockHeight,
                                                            this.blockWidth,
                                                            (block[2] - block[1])*this.blockHeight) } }

       drawTextRect(text, x, y, width, height)
            { this.c.clearRect(x, y, width, height)
              this.c.strokeRect(x, y, width, height)

              this.drawText(this.wrapText(text, width - this.textPadding*2 ), x + width/2, y + height/2) }

       wrapText(text, targetWidth)
            { let burrito
              let lines = ''
              while ((burrito = this.getWrap(text, targetWidth)).tail.length != 0)
                   { lines += burrito.head + '\n'
                     text = burrito.tail }
              lines += burrito.head
              return lines }

       getWrap(text, targetWidth)
            { let words = text.split(' ')
              for (let i=words.length; i>0; i--) // loops thru string backwards and finds words that fit in box
                   { let head = words.slice(0, i).join(' ')
                     if (this.c.measureText(head).width < targetWidth)
                            return { head: head, tail: words.slice(i, words.length).join(' ') } }
              return { head: '.', tail: '' } }

       drawText(text, centerX, centerY)
            { let lines = text.split('\n')
              centerY -= Math.floor(lines.length/2 + 1) * this.lineHeight + (lines.length%2 - 1) * this.lineHeight/2
              for (let line of lines)
                     this.c.fillText(line, centerX, centerY += this.lineHeight) }

       drawTimes()
            { for (let hour=this.startHour; hour<=this.endHour; hour++)
                   this.drawTextRect(hour + '', 0, this.marginY + (hour - this.startHour)*this.blockHeight, this.marginX, this.blockHeight) }

       drawDOWLabels()
            { for (let day=0; day<this.longDays.length; day++)
                   this.drawTextRect(this.longDays[day], this.marginX + day*this.blockWidth, 0, this.blockWidth, this.marginY ) }

       drawLines()
            { for (let hour=this.startHour+1; hour<=this.endHour; hour++)
                 { this.c.globalAlpha = this.guideOpacity
                   this.c.strokeRect(this.marginX, this.marginY + (hour - this.startHour)*this.blockHeight, this.canvas.width - this.marginY, 0)
                   this.c.globalAlpha = 1 } } }

/* parsing */

function parseBlock(string) // 'HH:MM-HH:MM Label'
     { return [string.substr(12), parseHours(string, 0, 5), parseHours(string, 6, 5)] }

function parseHours(string, start, end)
     { parts = string.substr(start, end).split(':')
       return parseInt(parts[0]) + parseInt(parts[1])/60 }
