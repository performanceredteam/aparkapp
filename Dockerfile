FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

#ARG BACKEND_URL
RUN NEXT_PUBLIC_BACKEND_URL=APP_NEXT_PUBLIC_API_URL npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
#COPY --from=build /app/public ./.env
COPY --from=build /app/entrypoint.sh ./entrypoint.sh

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
RUN chmod +x /app/entrypoint.sh
#ARG NEXT_PUBLIC_BACKEND_URL
#ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

#RUN chmod -R o=rx /app/.next
#RUN chmod +x /usr/bin/entrypoint.sh
EXPOSE 3000
#USER node
USER nextjs

RUN npx next telemetry disable
ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["npm", "start"]