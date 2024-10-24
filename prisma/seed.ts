/* eslint-disable import/newline-after-import */
import { prisma } from '../lib/prisma'
;(async () => {
  await prisma.user.deleteMany()
})()
