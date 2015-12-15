var segmentWriteKey = dotGet(Meteor, "settings.public.segment.write_key");
if (segmentWriteKey) {
  analytics.load(segmentWriteKey);
}


